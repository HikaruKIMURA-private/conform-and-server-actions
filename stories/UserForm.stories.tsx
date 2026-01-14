import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { UserForm } from "../app/components/UserForm";

const meta = {
  title: "Example/UserForm",
  component: UserForm,
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-zinc-50 p-8 dark:bg-black">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof UserForm>;

export default meta;
type Story = StoryObj<typeof meta>;

// 正常パターン（初期状態）
export const Default: Story = {};

// 名前のバリデーションエラー
export const NameError: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const submitButton = canvas.getByRole("button", { name: /登録/i });
    await userEvent.click(submitButton);
    // バリデーションエラーが表示されるのを待つ
    await expect(canvas.getByText(/名前は必須です/i)).toBeInTheDocument();
  },
};

// メールアドレスのバリデーションエラー
export const EmailError: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nameInput = canvas.getByLabelText(/名前/i);
    await userEvent.type(nameInput, "テストユーザー");
    await userEvent.tab(); // フォーカスを外す

    const emailInput = canvas.getByLabelText(/メールアドレス/i);
    await userEvent.type(emailInput, "invalid-email");
    await userEvent.tab(); // フォーカスを外してバリデーションをトリガー

    // バリデーションエラーが表示されるのを待つ
    await expect(
      canvas.getByText(/有効なメールアドレスを入力してください/i)
    ).toBeInTheDocument();
  },
};

// 性別のバリデーションエラー
export const GenderError: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nameInput = canvas.getByLabelText(/名前/i);
    await userEvent.type(nameInput, "テストユーザー");
    await userEvent.tab();

    const emailInput = canvas.getByLabelText(/メールアドレス/i);
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.tab();

    // 性別を選択せずに送信
    const submitButton = canvas.getByRole("button", { name: /登録/i });
    await userEvent.click(submitButton);

    // バリデーションエラーが表示されるのを待つ
    await expect(
      canvas.getByText(/性別を選択してください/i)
    ).toBeInTheDocument();
  },
};

// 利用規約のバリデーションエラー
export const TermsError: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nameInput = canvas.getByLabelText(/名前/i);
    await userEvent.type(nameInput, "テストユーザー");
    await userEvent.tab();

    const emailInput = canvas.getByLabelText(/メールアドレス/i);
    await userEvent.type(emailInput, "test@example.com");
    await userEvent.tab();

    // 性別を選択
    const genderMale = canvas.getByLabelText(/男性/i);
    await userEvent.click(genderMale);

    // 利用規約に同意せずに送信
    const submitButton = canvas.getByRole("button", { name: /登録/i });
    await userEvent.click(submitButton);

    // バリデーションエラーが表示されるのを待つ
    await expect(
      canvas.getByText(/利用規約への同意が必要です/i)
    ).toBeInTheDocument();
  },
};

// 複数のバリデーションエラー
export const MultipleErrors: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // 空のフォームで送信を試みる
    const submitButton = canvas.getByRole("button", { name: /登録/i });
    await userEvent.click(submitButton);

    // 複数のバリデーションエラーが表示されるのを待つ
    await expect(canvas.getByText(/名前は必須です/i)).toBeInTheDocument();
    await expect(
      canvas.getByText(/メールアドレスは必須です/i)
    ).toBeInTheDocument();
    await expect(
      canvas.getByText(/性別を選択してください/i)
    ).toBeInTheDocument();
    await expect(
      canvas.getByText(/利用規約への同意が必要です/i)
    ).toBeInTheDocument();
  },
};

// 送信成功パターン（フォーム入力完了状態）
export const Filled: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nameInput = canvas.getByLabelText(/名前/i);
    await userEvent.type(nameInput, "山田太郎");
    await userEvent.tab();

    const emailInput = canvas.getByLabelText(/メールアドレス/i);
    await userEvent.type(emailInput, "yamada@example.com");
    await userEvent.tab();

    // 性別を選択
    const genderMale = canvas.getByLabelText(/男性/i);
    await userEvent.click(genderMale);

    // 利用規約に同意
    const termsCheckbox = canvas.getByLabelText(/利用規約に同意します/i);
    await userEvent.click(termsCheckbox);

    // フォームが正しく入力されていることを確認
    await expect(nameInput).toHaveValue("山田太郎");
    await expect(emailInput).toHaveValue("yamada@example.com");
    await expect(genderMale).toBeChecked();
    await expect(termsCheckbox).toBeChecked();
  },
};
