export const maxDuration = 60;

import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import Chromium from "@sparticuz/chromium-min";
import {
    delay,
    getBroswerData,
    updateBrowserData,
} from "@/app/api/[username]/route";

import {
    chromiumPack,
    loginUrl,
    loginUsername,
    logingPass,
    isLocal,
} from "@/app/constants/constants";

export const GET = async (request, context) => {
    const username = context.params.username;

    const instaStoriesUrl =
        "https://www.instagram.com/stories/" + username + "/";

    // Get browser cookies and localStorage from supabase
    const browserData = await getBroswerData();

    let browser;
    if (process.env.NODE_ENV === "development") {
    }
    Chromium.setHeadlessMode = true;
    Chromium.setGraphicsMode = true;

    // Launch Puppeteer browser
    // browser = await puppeteer.launch({ headless: true });
    browser = await puppeteer.launch({
        ...(isLocal
            ? { channel: "chrome", headless: true }
            : {
                  args: Chromium.args,
                  executablePath: await Chromium.executablePath(chromiumPack),
                  headless: true,
              }),
    });
    const page = await browser.newPage();

    // Set cookies and localStorage from supabase
    const savedCookies = browserData[0].cookies;
    await page.setCookie(...savedCookies);
    const savedLocalStorageData = browserData[0].local_storages;

    const videoUrls = new Map(); // Use a Map to ensure unique _nc_gid for videos
    const audioUrls = new Map(); // Use a Map to ensure unique _nc_gid for audios

    // Listen for all responses
    page.on("response", async (response) => {
        const url = response.url();
        const gid = extractGid(url); // Extract the _nc_gid

        if (gid) {
            if (url.startsWith("https://scontent.cdninstagram.com/v/t66")) {
                // Check if _nc_gid is already present
                if (!videoUrls.has(gid)) {
                    videoUrls.set(gid, url); // Add unique video URL by _nc_gid
                }
            } else if (
                url.startsWith("https://scontent.cdninstagram.com/v/t50")
            ) {
                // Check if _nc_gid is already present
                if (!audioUrls.has(gid)) {
                    audioUrls.set(gid, url); // Add unique audio URL by _nc_gid
                }
            }
        }
    });

    // Navigate to stories
    await page.goto(instaStoriesUrl);

    await page.evaluate((localStorageData) => {
        for (const key in localStorageData) {
            localStorage.setItem(key, localStorageData[key]);
        }
    }, savedLocalStorageData);

    // Check if logged in
    const isLoggedIn = (await page.content()).match("Don't have an account?");

    // Login if not yet logged in
    if (isLoggedIn) {
        console.log("loggin in...");
        await page.goto(loginUrl);
        await page.waitForSelector("form", { visible: true });

        await page.type('input[name="username"]', loginUsername);
        await page.type('input[name="password"]', logingPass);

        await page.click('button[type="submit"]');

        // Wait for login to complete
        await delay(process.env.LOGIN_DELAY);

        // Save cookies
        const cookies = await page.cookies();

        // Save localStorage
        const localStorageData = await page.evaluate(() => {
            const json = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                json[key] = localStorage.getItem(key);
            }
            return json;
        });
        await updateBrowserData({
            cookies: cookies,
            localStorage: localStorageData,
        });
    }

    console.log("logged in.");

    const storiesCount = await page.evaluate(() => {
        const element = document.querySelector(".x1ned7t2.x78zum5");
        return element ? element.children.length : null;
    });

    if (!storiesCount) {
        return NextResponse.json([], { status: 200 });
    }

    // Click View Story Button
    await page.locator("div ::-p-text(View story)").click();

    // Match video and audio URLs based on _nc_gid
    const allUrls = [];

    // Loop through the total number of stories
    for (let i = 0; i < storiesCount; i++) {
        const storyContainerClassName =
            "div.x6s0dn4.x1lq5wgf.xgqcy7u.x30kzoy.x9jhf4c.x78zum5.xdt5ytf.x5yr21d.xl56j7k.x6ikm8r.x10wlt62.x1n2onr6.xh8yej3 img";
        const hasImage = await page.$(storyContainerClassName);

        // Push if story is an image
        if (hasImage) {
            const imageSrc = await page.evaluate((el) => el.src, hasImage);
            allUrls.push({ type: "image", url: imageSrc });
        }

        await page.keyboard.press("ArrowRight");
        await delay(500); // Wait after each slide transition for the requests to be made
    }

    await delay(storiesCount * 500); // Wait for .5 seconds per story to ensure all network requests are captured

    videoUrls.forEach((videoUrl, gid) => {
        const matchingAudioUrl = audioUrls.get(gid); // Find matching audioUrl by _nc_gid

        allUrls.push({
            type: "video",
            videoUrl,
            audioUrl: matchingAudioUrl ? matchingAudioUrl : null,
        });
    });

    // Close the browser once done
    page.close();
    browser.close();

    // Return matched URL pairs as JSON response
    return NextResponse.json(allUrls);
};

// Utility function to extract _nc_gid from the URL
function extractGid(url) {
    const match = url.match(/_nc_gid=([^&]+)/);
    return match ? match[1] : null;
}
