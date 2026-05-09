import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ThreadCard from '../../../src/components/ThreadList/ThreadCard';

// Mock userService so tests don't depend on dummyData user lookups
vi.mock('../../../src/services/userService', () => ({
  getUserName: (userId) => `User-${userId}`,
}));

const mockThread = {
  _id: 't1',
  title: 'What is the best JavaScript framework in 2025?',
  content: 'I have been comparing React, Vue, and Angular. Curious what others think.',
  author: 'u1',
  subredditName: 'webdev',
  upvotedBy: ['u2', 'u3', 'u4'],
  downvotedBy: ['u5'],
};

// Computed vote count: upvotedBy.length - downvotedBy.length = 3 - 1 = 2

describe('ThreadCard', () => {
  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ── Rendering ──────────────────────────────────────────────────────────────

  it('renders the thread title', () => {
    render(<ThreadCard thread={mockThread} homePage />);
    expect(
      screen.getByText('What is the best JavaScript framework in 2025?')
    ).toBeInTheDocument();
  });

  it('renders the thread content', () => {
    render(<ThreadCard thread={mockThread} homePage />);
    expect(
      screen.getByText(/comparing React, Vue, and Angular/i)
    ).toBeInTheDocument();
  });

  it('renders the computed vote count (upvotes minus downvotes)', () => {
    render(<ThreadCard thread={mockThread} homePage />);
    // 3 upvotes - 1 downvote = 2
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders the subreddit name', () => {
    render(<ThreadCard thread={mockThread} homePage />);
    expect(screen.getByText('r/webdev')).toBeInTheDocument();
  });

  it('renders the resolved author name via getUserName', () => {
    render(<ThreadCard thread={mockThread} homePage />);
    expect(screen.getByText('User-u1')).toBeInTheDocument();
  });

  it('renders upvote and downvote buttons', () => {
    render(<ThreadCard thread={mockThread} homePage />);
    expect(screen.getByRole('button', { name: /upvote/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /downvote/i })).toBeInTheDocument();
  });

  it('renders "View Comments" button when homePage is true', () => {
    render(<ThreadCard thread={mockThread} homePage onSelect={vi.fn()} />);
    expect(
      screen.getByRole('button', { name: /view comments/i })
    ).toBeInTheDocument();
  });

  it('does NOT render "View Comments" button when homePage is false', () => {
    render(<ThreadCard thread={mockThread} homePage={false} goBack={vi.fn()} />);
    expect(
      screen.queryByRole('button', { name: /view comments/i })
    ).not.toBeInTheDocument();
  });

  it('renders "Back to Home" button when homePage is false', () => {
    render(<ThreadCard thread={mockThread} homePage={false} goBack={vi.fn()} />);
    expect(
      screen.getByRole('button', { name: /back to home/i })
    ).toBeInTheDocument();
  });

  it('does NOT render "Back to Home" button when homePage is true', () => {
    render(<ThreadCard thread={mockThread} homePage onSelect={vi.fn()} />);
    expect(
      screen.queryByRole('button', { name: /back to home/i })
    ).not.toBeInTheDocument();
  });

  // ── Props / different data inputs ──────────────────────────────────────────

  it('displays a different subreddit name correctly', () => {
    const scienceThread = { ...mockThread, subredditName: 'science' };
    render(<ThreadCard thread={scienceThread} homePage />);
    expect(screen.getByText('r/science')).toBeInTheDocument();
  });

  it('displays vote count of 0 when upvotedBy and downvotedBy are equal length', () => {
    const evenThread = {
      ...mockThread,
      upvotedBy: ['u2'],
      downvotedBy: ['u3'],
    };
    render(<ThreadCard thread={evenThread} homePage />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('displays a negative vote count when downvotes exceed upvotes', () => {
    const downvotedThread = {
      ...mockThread,
      upvotedBy: [],
      downvotedBy: ['u2', 'u3', 'u4'],
    };
    render(<ThreadCard thread={downvotedThread} homePage />);
    expect(screen.getByText('-3')).toBeInTheDocument();
  });

  it('renders correctly with empty upvotedBy and downvotedBy arrays', () => {
    const noVoteThread = { ...mockThread, upvotedBy: [], downvotedBy: [] };
    render(<ThreadCard thread={noVoteThread} homePage />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders a different thread title', () => {
    const otherThread = { ...mockThread, title: 'Is TypeScript worth learning?' };
    render(<ThreadCard thread={otherThread} homePage />);
    expect(screen.getByText('Is TypeScript worth learning?')).toBeInTheDocument();
  });

  // ── Interactions ───────────────────────────────────────────────────────────

  it('calls onSelect with the thread when "View Comments" is clicked', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    render(<ThreadCard thread={mockThread} homePage onSelect={handleSelect} />);

    await user.click(screen.getByRole('button', { name: /view comments/i }));

    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith(mockThread);
  });

  it('calls onSelect again on subsequent "View Comments" clicks', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    render(<ThreadCard thread={mockThread} homePage onSelect={handleSelect} />);

    const btn = screen.getByRole('button', { name: /view comments/i });
    await user.click(btn);
    await user.click(btn);

    expect(handleSelect).toHaveBeenCalledTimes(2);
  });

  it('calls goBack when "Back to Home" is clicked', async () => {
    const user = userEvent.setup();
    const handleGoBack = vi.fn();
    render(
      <ThreadCard thread={mockThread} homePage={false} goBack={handleGoBack} />
    );

    await user.click(screen.getByRole('button', { name: /back to home/i }));

    expect(handleGoBack).toHaveBeenCalledTimes(1);
  });

  it('upvote button triggers alert (stub behaviour) and does not throw', async () => {
    const user = userEvent.setup();
    render(<ThreadCard thread={mockThread} homePage onSelect={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /upvote/i }));

    expect(window.alert).toHaveBeenCalledWith('Upvote clicked!');
  });

  it('downvote button triggers alert (stub behaviour) and does not throw', async () => {
    const user = userEvent.setup();
    render(<ThreadCard thread={mockThread} homePage onSelect={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /downvote/i }));

    expect(window.alert).toHaveBeenCalledWith('Downvote clicked!');
  });

  it('does not call onSelect when upvote is clicked', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    render(<ThreadCard thread={mockThread} homePage onSelect={handleSelect} />);

    await user.click(screen.getByRole('button', { name: /upvote/i }));

    expect(handleSelect).not.toHaveBeenCalled();
  });

  it('does not call onSelect when downvote is clicked', async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    render(<ThreadCard thread={mockThread} homePage onSelect={handleSelect} />);

    await user.click(screen.getByRole('button', { name: /downvote/i }));

    expect(handleSelect).not.toHaveBeenCalled();
  });
});
