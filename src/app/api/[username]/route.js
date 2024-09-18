import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import puppeteer from "puppeteer";
import Chromium from "@sparticuz/chromium-min";

const chromiumPack =
    "https://github.com/Sparticuz/chromium/releases/download/v127.0.0/chromium-v127.0.0-pack.tar";

export const GET = async (request, context) => {
    const loginUrl = "https://www.instagram.com/accounts/login/";
    const username = context.params.username;
    const instaStoriesUrl =
        "https://www.instagram.com/stories/" + username + "/";

    const loginUsername = process.env.INSTA_USERNAME;
    const logingPass = process.env.INSTA_PASSWORD;

    // Get browser cookies and localStorage from supabase
    const browserData = await getBroswerData();

    let browser;
    const isLocal = process.env.DEPLOYMENT === "development";
    if (process.env.NODE_ENV === "development") {
    }
    Chromium.setHeadlessMode = true;
    Chromium.setGraphicsMode = true;
    const chromeArgs = [
        "--font-render-hinting=none", // Improves font-rendering quality and spacing
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--disable-animations",
        "--disable-background-timer-throttling",
        "--disable-restore-session-state",
        "--disable-web-security", // Only if necessary, be cautious with security implications
        "--single-process", // Be cautious as this can affect stability in some environments
    ];

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

    const savedLocalStorageData = browserData[0].localStorage;
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
        await page.goto(loginUrl);
        await page.waitForSelector("form", { visible: true });

        await page.type('input[name="username"]', loginUsername);
        await page.type('input[name="password"]', logingPass);

        await page.click('button[type="submit"]');

        // Wait for login to complete
        await delay(5000);

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
            cookies: JSON.stringify(cookies),
            localStorage: JSON.stringify(localStorageData),
        });
    }

    await page.goto(instaStoriesUrl);

    // Check if a div contains the text "View story"
    await page.locator("div ::-p-text(View story)").click();

    // Wait for the story to load
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

const getBroswerData = async () => {
    const supabase = createClient();
    const { data: browserData, error } = await supabase
        .from("browser")
        .select();

    return browserData;
};
const updateBrowserData = async ({ cookies, localStorage }) => {
    const { data, error } = await supabase
        .from("browser")
        .update({
            cookies: cookies,
            local_storage: localStorage,
        })
        .eq(
            "id",
            (
                await supabase
                    .from("browser")
                    .select("id")
                    .order("id", { ascending: true })
                    .limit(1)
            ).single()
        ).id;
};

function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}
