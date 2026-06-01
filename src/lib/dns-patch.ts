import { setGlobalDispatcher, Agent } from "undici";
import { lookup } from "node:dns";

setGlobalDispatcher(new Agent({ connect: { lookup } }));
