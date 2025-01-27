import { render, waitFor } from '@testing-library/react';
import { componentWithBrowserTitle } from '../component-with-browser-title';
import { withHelmet } from '@test-utills/hocs';

const FAKE_TITLE = 'Fake title';
const FAKE_PARAGRAPH_TEXT = 'Fake pagragraph text';
const FakeParagraphComponent = (): JSX.Element => <p>{FAKE_PARAGRAPH_TEXT}</p>;

describe('HOC componentWithBrowserTitle', () => {
  it('should correct render children', () => {
    const HocComponent = componentWithBrowserTitle(FakeParagraphComponent, FAKE_TITLE);
    const wrappedComponent = withHelmet(<HocComponent />);

    const screen = render(wrappedComponent);

    expect(screen.getByText(FAKE_PARAGRAPH_TEXT)).toBeInTheDocument();
  });

  it('should correct set title', async () => {
    const HocComponent = componentWithBrowserTitle(FakeParagraphComponent, FAKE_TITLE);
    const wrappedComponent = withHelmet(<HocComponent />);

    render(wrappedComponent);

    await waitFor(() => expect(document.title).toBe(FAKE_TITLE));
  });
});
