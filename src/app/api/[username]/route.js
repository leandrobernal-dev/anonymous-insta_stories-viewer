export const maxDuration = 60;
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import puppeteer from "puppeteer";
import Chromium from "@sparticuz/chromium-min";

const chromiumPack =
    "https://github.com/Sparticuz/chromium/releases/download/v127.0.0/chromium-v127.0.0-pack.tar";
const loginUrl = "https://www.instagram.com/accounts/login/";
const loginUsername = process.env.INSTA_USERNAME;
const logingPass = process.env.INSTA_PASSWORD;
const isLocal = process.env.DEPLOYMENT === "development";

export const GET = async (request, context) => {
    const username = context.params.username;
    const instaProfileUrl = "https://www.instagram.com/" + username + "/";
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
    await page.goto(loginUrl);

    await page.evaluate((localStorageData) => {
        for (const key in localStorageData) {
            localStorage.setItem(key, localStorageData[key]);
        }
    }, savedLocalStorageData);

    // Check if logged in
    const title = await page.title();
    const isLoggedIn = !title.toLowerCase().includes("login");

    // Login if not yet logged in
    if (!isLoggedIn) {
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

    // Get Profile Details
    await page.goto(instaProfileUrl);
    await page.waitForSelector("header", { timeout: 5000 }); // Wait for DOM to load
    const profileDetails = await page.evaluate(async () => {
        const isPrivate = !![...document.querySelectorAll("span")].find(
            (span) => span.textContent.includes("This account is private")
        );

        // Find the specific element using querySelector
        const profilePicElement = document.querySelector(
            "header > section:nth-child(1) > div > div > span > img, header > section:nth-child(1) > div > div > a > img"
        );
        const profilePic = profilePicElement ? profilePicElement.src : "";
        // Check if the profile picture's parent element is an anchor tag | anchor tag means no story available
        const hasStory = profilePicElement?.parentElement.tagName === "SPAN";

        const name =
            document.querySelector(
                "header > section:nth-child(4) > div > div:first-child > span:first-child"
            )?.textContent || "";

        const pronoun =
            document.querySelector(
                "header > section:nth-child(4) > div > div:first-child > span:nth-child(2)"
            )?.textContent || "";

        const description = document.querySelector(
            "header > section:nth-child(4) > div > span > div"
        );
        const descriptionHtml = description ? description.innerHTML : "";

        const posts =
            document.querySelector(
                "header > section:nth-child(3) > ul > li:nth-child(1) > div > span > span"
            )?.textContent || "";

        const followers =
            document.querySelector(
                "header > section:nth-child(3) > ul > li:nth-child(2) > div > a > span > span"
            )?.textContent || "";

        const following =
            document.querySelector(
                "header > section:nth-child(3) > ul > li:nth-child(3) > div > a > span > span"
            )?.textContent || "";

        return {
            name,
            profilePic,
            pronoun,
            descriptionHtml,
            posts,
            followers,
            following,
            hasStory,
            isPrivate,
        };
    });

    // Return if no story
    if (!profileDetails.hasStory) {
        return NextResponse.json({ storyCount: 0, ...profileDetails });
    }

    // Get story count
    await page.goto(instaStoriesUrl);
    const storyCount = await page.evaluate(() => {
        // const parentElement = document.querySelector(".x1ned7t2.x78zum5");
        const parentElement = document.querySelector(
            "section > div:first-child > div > div > div:first-child > div > div:first-child > div"
        );
        return parentElement ? parentElement.childElementCount : 0;
    });

    return NextResponse.json({ storyCount, ...profileDetails });
};

const getBroswerData = async () => {
    const supabase = createClient();
    const { data: browserData, error } = await supabase
        .from("browser")
        .select();

    return browserData;
};
const updateBrowserData = async ({ cookies, localStorage }) => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("browser")
        .update({
            cookies: cookies,
            local_storage: localStorage,
        })
        .eq("id", 1);
};

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}
