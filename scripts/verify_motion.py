"""Check visible motion, readable orbit labels, pause controls and reduced motion."""
import json
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).resolve().parents[1]
BASE = sys.argv[1] if len(sys.argv) > 1 else 'http://127.0.0.1:5173/MohamedAzzam-Portfolio/'
OUT = ROOT / 'audit' / 'motion'
OUT.mkdir(parents=True, exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 1000})
    errors = []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.goto(BASE, wait_until='networkidle')
    page.mouse.move(5, 5)

    def transform(selector):
        return page.locator(selector).evaluate('(el) => getComputedStyle(el).transform')

    selectors = ['.portrait-frame', '.floating-label', '.hero-spark', '.marquee-track']
    before = [transform(selector) for selector in selectors]
    page.wait_for_timeout(800)
    assert all(transform(selector) != initial for selector, initial in zip(selectors, before)), 'Hero/bar should move'
    page.screenshot(path=str(OUT / 'hero-desktop.png'))

    pause = page.get_by_role('button', name='Pause animations', exact=True)
    pause.click()
    frozen = [transform(selector) for selector in selectors]
    page.wait_for_timeout(400)
    assert frozen == [transform(selector) for selector in selectors], 'Pause must freeze motion'
    page.reload(wait_until='networkidle')
    expect(page.get_by_role('button', name='Resume animations', exact=True)).to_be_visible()
    assert page.locator('.floating-label').evaluate('(el) => getComputedStyle(el).animationPlayState') == 'paused'
    page.get_by_role('button', name='Resume animations', exact=True).click()

    page.locator('.about-orbit').scroll_into_view_if_needed()
    page.mouse.move(5, 5)
    page.wait_for_timeout(800)
    first = page.locator('.orbit-ai .orbit-label').bounding_box()
    page.wait_for_timeout(900)
    second = page.locator('.orbit-ai .orbit-label').bounding_box()
    assert abs(first['x'] - second['x']) + abs(first['y'] - second['y']) > 5, 'Orbit label should travel'
    for label in page.locator('.orbit-label').all():
        metrics = label.evaluate('(el) => ({width: el.getBoundingClientRect().width, height: el.getBoundingClientRect().height, naturalWidth: el.offsetWidth, naturalHeight: el.offsetHeight})')
        assert abs(metrics['width'] - metrics['naturalWidth']) < 2 and abs(metrics['height'] - metrics['naturalHeight']) < 2, 'Orbit text should stay upright'
    page.screenshot(path=str(OUT / 'orbit-desktop.png'))

    # Two equal groups and a half-track translation make the marquee seam continuous.
    groups = page.locator('.marquee-group').all()
    assert len(groups) == 2
    assert abs(groups[0].bounding_box()['width'] - groups[1].bounding_box()['width']) < 1
    expect(groups[1]).to_have_attribute('aria-hidden', 'true')
    assert page.locator('.hero-visual').get_attribute('data-motion-visible') == 'false'
    assert page.locator('.floating-label').evaluate('(el) => getComputedStyle(el).animationPlayState') == 'paused'

    for width in [375, 390, 768, 1024, 1440]:
        page.set_viewport_size({'width': width, 'height': 900})
        page.locator('#home').scroll_into_view_if_needed()
        page.wait_for_timeout(300)
        assert not page.evaluate('document.documentElement.scrollWidth > innerWidth'), f'Overflow at {width}'
        page.locator('.about-orbit').scroll_into_view_if_needed()
        expect(page.locator('.about-orbit')).to_be_visible()
        assert not page.evaluate('document.documentElement.scrollWidth > innerWidth')
        if width == 390:
            page.screenshot(path=str(OUT / 'orbit-mobile.png'))

    page.emulate_media(reduced_motion='reduce')
    page.locator('#home').scroll_into_view_if_needed()
    for selector in ['.portrait-frame', '.floating-label', '.hero-spark', '.marquee-track', '.orbit-runner', '.orbit-label']:
        assert page.locator(selector).first.evaluate('(el) => getComputedStyle(el).animationName') == 'none', selector
    expect(page.locator('.motion-toggle')).to_be_hidden()
    expect(page.locator('.marquee-group').nth(1)).to_be_hidden()
    expect(page.locator('.marquee-group').first).to_be_visible()
    assert not page.evaluate('document.documentElement.scrollWidth > innerWidth')
    assert not errors, errors
    print(json.dumps({'base': BASE, 'floatingPortrait': 'PASS', 'uprightOrbitLabels': 'PASS', 'seamlessMarquee': 'PASS', 'persistentPause': 'PASS', 'offscreenPause': 'PASS', 'reducedMotion': 'PASS', 'responsiveWidths': [375, 390, 768, 1024, 1440], 'errors': errors}, indent=2), flush=True)
    browser.close()
