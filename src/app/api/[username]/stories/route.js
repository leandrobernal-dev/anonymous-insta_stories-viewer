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

    // Navigate to stories
    await page.goto(instaStoriesUrl);

    // Click View Story Button if it exists
    await page.locator("div ::-p-text(View story)").click();

    // Intercept network requests to find the actual media (video/image) URLs
    await page.setRequestInterception(true);
    // Listen for all network requests
    page.on("request", (request) => {
        request.continue(); // Let the request proceed
    });

    // Close browser
    page.close();
    browser.close();

    return NextResponse.json({ username });

    // for (let i = 0; i < storyCount; i++) {
    let mediaUrl = "";
    const isVideo = await page.evaluate(() => {
        // Select the parent div by its class
        const parentDiv = document.querySelector(".x5yr21d.x1n2onr6.xh8yej3");

        // If the parent div exists, check if there's an <img> inside (can be a nested child)
        if (parentDiv) {
            return parentDiv.querySelector("video") !== null;
        }

        return false;
    });
    console.log(storyCount, isVideo);
    // page.on("response", async (response) => {
    //     const requestUrl = response.url();
    //     const isVideo = requestUrl.includes("bytestart");
    //     console.log("isVideo: ", isVideo);

    //     if (
    //         requestUrl.includes("https://scontent.cdninstagram.com") &&
    //         mediaUrl.length === 0
    //     ) {
    //         mediaUrl = requestUrl;
    //     }
    // });
    // await page.screenshot({ path: i + ".png" });
    // await page.keyboard.press("ArrowRight");
    // }

    // console.log(mediaUrl);

    await delay(100);
    await page.close();
    return NextResponse.json({ storyCount });

    // Intercept network requests to find the actual media (video/image) URLs
    await page.setRequestInterception(true);
    // Listen for all network requests
    page.on("request", (request) => {
        request.continue(); // Let the request proceed
    });

    let mediaUrls = [];
    let audioUrl = "";
    let videoUrl = "";
    // Listen for network responses (we're looking for XHR/Fetch ones)
    page.on("response", async (response) => {
        const requestUrl = response.url();
        if (requestUrl.includes("https://scontent.cdninstagram.com")) {
            mediaUrls.push(requestUrl.replace(/&bytestart.*$/, ""));

            if (requestUrl.includes("video_dashinit")) {
                videoUrl = requestUrl
                    .replace(/\s+/g, "")
                    .replace(/&bytestart.*$/, "");
            } else {
                audioUrl = requestUrl
                    .replace(/\s+/g, "")
                    .replace(/&bytestart.*$/, "");
            }
        }
    });

    await delay(300);
    await page.close();

    return NextResponse.json({ audioUrl, videoUrl });
};
