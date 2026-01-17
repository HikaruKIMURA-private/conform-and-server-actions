import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { UserForm } from "./UserForm";

// useActionState をモック
vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");
  return {
    ...actual,
    useActionState: vi.fn(),
  };
});

describe("UserForm", () => {
  const getMockUseActionState = async () => {
    const { useActionState } = await import("react");
    return useActionState as ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    cleanup();
    vi.clearAllMocks();

    // useActionState のデフォルトの戻り値を設定
    const mockFn = await getMockUseActionState();
    mockFn.mockReturnValue([
      undefined, // lastResult
      vi.fn(), // formAction
      false, // isPending
    ]);
  });

  afterEach(() => {
    cleanup();
  });

  it("フォームが正しくレンダリングされる", () => {
    render(<UserForm />);

    expect(screen.getByText("ユーザー登録フォーム")).toBeInTheDocument();
    expect(screen.getByLabelText("名前")).toBeInTheDocument();
    expect(screen.getByLabelText("メールアドレス")).toBeInTheDocument();
    expect(screen.getByText("性別")).toBeInTheDocument();
    expect(screen.getByText("利用規約に同意します")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "登録" })).toBeInTheDocument();
  });

  it("性別のラジオボタンが正しく表示される", () => {
    render(<UserForm />);

    expect(screen.getAllByLabelText("男性").length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText("女性").length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText("その他").length).toBeGreaterThan(0);
  });

  it("フォームフィールドに入力できる", async () => {
    const user = userEvent.setup();
    render(<UserForm />);

    const nameInput = screen.getAllByLabelText("名前")[0];
    const emailInput = screen.getAllByLabelText("メールアドレス")[0];

    await user.type(nameInput, "山田太郎");
    await user.type(emailInput, "test@example.com");

    expect(nameInput).toHaveValue("山田太郎");
    expect(emailInput).toHaveValue("test@example.com");
  });
});
