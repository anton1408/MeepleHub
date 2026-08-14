import type { Meta, StoryObj } from '@storybook/react-vite';
import { UiButton } from '@meeplehub/ui-kit';

const meta = {
  title: 'UI/UiButton',
  component: UiButton,
  tags: ['autodocs'],
  args: { children: 'Button' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'],
    },
  },
} satisfies Meta<typeof UiButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Outline: Story = { args: { variant: 'outline' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Destructive: Story = { args: { variant: 'destructive' } };
export const Link: Story = { args: { variant: 'link' } };

export const AllVariants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <UiButton {...args} variant="default">
        Default
      </UiButton>
      <UiButton {...args} variant="outline">
        Outline
      </UiButton>
      <UiButton {...args} variant="secondary">
        Secondary
      </UiButton>
      <UiButton {...args} variant="ghost">
        Ghost
      </UiButton>
      <UiButton {...args} variant="destructive">
        Destructive
      </UiButton>
      <UiButton {...args} variant="link">
        Link
      </UiButton>
    </div>
  ),
};
