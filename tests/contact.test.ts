import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { ContactForm } from "@/components/contact-form";

test("設定済み問い合わせフォームはJavaScriptなしでもmailtoへPOSTする", () => {
  const markup = renderToStaticMarkup(
    createElement(ContactForm, { address: "contact@kyoupoke.test" }),
  );

  assert.match(markup, /<form\b/);
  assert.match(markup, /action="mailto:contact@kyoupoke\.test"/);
  assert.match(markup, /method="post"/);
  assert.match(markup, /enctype="text\/plain"/i);
});

test("問い合わせ先が未設定ならフォームを出力しない", () => {
  const markup = renderToStaticMarkup(createElement(ContactForm, {}));

  assert.doesNotMatch(markup, /<form\b/);
  assert.match(markup, /お問い合わせ窓口は現在準備中/);
});
