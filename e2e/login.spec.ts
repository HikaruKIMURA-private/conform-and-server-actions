import { expect, test } from "@playwright/test";

// テストごとにユニークなメールアドレスを生成
const generateUniqueEmail = () =>
  `test-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@test.com`;

test.describe("認証フロー", () => {
  test("サインアップ後にダッシュボードへ遷移する", async ({ page }) => {
    const testEmail = generateUniqueEmail();
    const testPassword = "testpassword123";

    await page.goto("/signup");

    // サインアップフォームに入力
    await page.getByRole("textbox", { name: "名前" }).fill("テストユーザー");
    await page.getByRole("textbox", { name: "メールアドレス" }).fill(testEmail);
    await page.getByLabel("パスワード", { exact: true }).fill(testPassword);
    await page.getByLabel("パスワード（確認）").fill(testPassword);

    // サインアップボタンをクリック
    await page.getByRole("button", { name: "登録", exact: true }).click();

    // ダッシュボードへ遷移することを確認
    await page.waitForURL("/dashboard");
    await expect(page).toHaveURL("/dashboard");
  });

  test("登録済みユーザーでログインできる", async ({ page }) => {
    const testEmail = generateUniqueEmail();
    const testPassword = "testpassword123";

    // まずサインアップしてユーザーを作成
    await page.goto("/signup");
    await page.getByRole("textbox", { name: "名前" }).fill("テストユーザー");
    await page.getByRole("textbox", { name: "メールアドレス" }).fill(testEmail);
    await page.getByLabel("パスワード", { exact: true }).fill(testPassword);
    await page.getByLabel("パスワード（確認）").fill(testPassword);
    await page.getByRole("button", { name: "登録", exact: true }).click();
    await page.waitForURL("/dashboard");

    // ログアウト（ダッシュボードにログアウトボタンがあると仮定）
    // ログアウト機能がない場合は、cookieをクリアしてログインページへ
    await page.context().clearCookies();

    // ログインページへ移動してログイン
    await page.goto("/login");
    await page.getByRole("textbox", { name: "メールアドレス" }).fill(testEmail);
    await page
      .getByRole("textbox", { name: "パスワード", exact: true })
      .fill(testPassword);
    await page.getByRole("button", { name: "ログイン", exact: true }).click();

    // ダッシュボードへ遷移することを確認
    await page.waitForURL("/dashboard");
    await expect(page).toHaveURL("/dashboard");
  });
});
