import pt from "puppeteer";
import { Queue } from "bullmq";
import Redis from "ioredis";
import { Members } from "./membersLinks.mjs";

const connection = new Redis({
    maxRetriesPerRequest: null,
});

const queues = new Queue("members", {
    connection,
});

for (const member of Members) {
    console.log(member);
    await queues.add("member", member, {
        delay: 10000,
    });
}
