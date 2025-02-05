"use strict";

import { getQueryVariable } from "./query.js";

export const IS_PUTER = !!getQueryVariable("puter.app_instance_id");

if (IS_PUTER) {
    const script = document.createElement("script");
    script.src = "https://js.puter.com/v2/";
    document.head.appendChild(script);
}
