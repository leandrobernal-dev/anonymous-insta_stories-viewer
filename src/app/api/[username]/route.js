export const maxDuration = 60;
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import puppeteer from "puppeteer";
import Chromium from "@sparticuz/chromium-min";

import {
    chromiumPack,
    loginUrl,
    loginUsername,
    logingPass,
    isLocal,
} from "@/app/constants/constants";

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
    Chromium.setHeadlessMode = "shell";
    Chromium.setGraphicsMode = true;

    // Launch Puppeteer browser
    browser = await puppeteer.launch({
        ...(isLocal
            ? { channel: "chrome", headless: "shell" }
            : {
                  args: Chromium.args,
                  executablePath: await Chromium.executablePath(chromiumPack),
                  headless: "shell",
              }),
    });
    const page = await browser.newPage();

    // Set cookies and localStorage from supabase
    const savedCookies = browserData[0].cookies;
    await page.setCookie(...savedCookies);

    const savedLocalStorageData = browserData[0].local_storages;

    // Go to login page
    await page.goto(loginUrl);

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

    // Get Profile Details
    await page.goto(instaProfileUrl);

    // Check if profile exists
    const isValid = (await page.content()).match(
        "Sorry, this page isn't available."
    );

    if (isValid !== null) {
        // Close browser
        page.close();
        browser.close();
        return NextResponse.json({ valid: false });
    }
    await page.waitForSelector("header", { timeout: 10000 }); // Wait for DOM to load

    const mainEl = await page.evaluate(() => {
        const main = document.querySelector("main");
        return main.outerHTML;
    });

    // Close browser
    page.close();
    browser.close();

    return NextResponse.json({ mainEl });
};

export const getBroswerData = async () => {
    const supabase = createClient();
    const { data: browserData, error } = await supabase
        .from("browser")
        .select();

    return browserData;
};
export const updateBrowserData = async ({ cookies, localStorage }) => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("browser")
        .update({
            cookies: cookies,
            local_storage: localStorage,
        })
        .eq("id", 1);
};

export function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}
