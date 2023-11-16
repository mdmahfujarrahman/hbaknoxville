import { Worker, delay } from "bullmq";
import Redis from "ioredis";
import { extractCompanyData } from "./extractCompanyData.mjs";
import pt from "puppeteer";
import fs from "fs";
import { saveToDb } from "./db.mjs";

// Create a connection to local Redis
const connection = new Redis({
    maxRetriesPerRequest: null,
});

const browser = await pt.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
});

new Worker(
    "members",
    async (job) => {
        const page = await browser.newPage();
        const { data } = job;
        const singleMemberData = await extractCompanyData(page, data);
        console.log(singleMemberData);
        saveToDb(singleMemberData);
    },
    {
        connection,
    }
);
