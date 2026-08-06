import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { UiButton } from './UiButton';

describe('UiButton', () => {
  it('renders children', () => {
    render(<UiButton>Save</UiButton>);

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('applies default variant and size data attributes', () => {
    render(<UiButton>Save</UiButton>);

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveAttribute('data-slot', 'button');
    expect(button).toHaveAttribute('data-variant', 'default');
    expect(button).toHaveAttribute('data-size', 'default');
  });

  it('applies the given variant and size', () => {
    render(
      <UiButton variant="destructive" size="lg">
        Delete
      </UiButton>,
    );

    const button = screen.getByRole('button', { name: 'Delete' });
    expect(button).toHaveAttribute('data-variant', 'destructive');
    expect(button).toHaveAttribute('data-size', 'lg');
  });

  it('merges a custom className with the variant classes', () => {
    render(<UiButton className="custom-class">Save</UiButton>);

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveClass('custom-class');
    expect(button.className).not.toBe('custom-class');
  });

  it('forwards native button props', () => {
    render(
      <UiButton type="submit" aria-label="submit form">
        Go
      </UiButton>,
    );

    const button = screen.getByRole('button', { name: 'submit form' });
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<UiButton onClick={onClick}>Save</UiButton>);

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <UiButton onClick={onClick} disabled>
        Save
      </UiButton>,
    );

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toBeDisabled();

    await user.click(button);

    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders as the child element when asChild is set', () => {
    render(
      <UiButton asChild variant="link">
        <a href="/games">Games</a>
      </UiButton>,
    );

    const link = screen.getByRole('link', { name: 'Games' });
    expect(link).toHaveAttribute('href', '/games');
    expect(link).toHaveAttribute('data-slot', 'button');
    expect(link).toHaveAttribute('data-variant', 'link');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
