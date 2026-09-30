import { test, expect } from '@playwright/test';
import type { AirtimeCase } from '../type/airtime';
import airtime from '../testdata/airtime-activity.json';

const cases = airtime as AirtimeCase[];

test.describe('Purchase airtime', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3001/airtime');
    });

    for (const tc of cases) {
        test(`${tc.caseId} : ${tc.scenario}`, async ({ page }) => {

            if (tc.purchase.network) {
                await page
                .getByRole('combobox', { name: 'Network' })
                .selectOption({ label: tc.purchase.network });
    }

            await page
                .getByLabel('Cellphone number')
                .fill(tc.purchase.cellphone);

            await page
                .getByLabel('Airtime amount')
                .fill(tc.purchase.amount);

            await page
                .getByRole('button', { name: 'Buy airtime' })
                .click();

            const status = page.getByTestId('airtime-result');

            await expect(status)
                .toHaveAttribute('data-result', tc.expect.outcome);

            await expect(status)
                .toHaveText(tc.expect.message);

            await expect(page.getByTestId('balance'))
                .toHaveText(tc.expect.walletBalance);
        });
    }
});