import '@testing-library/jest-dom';
import { act, render, waitFor, within } from '@testing-library/react';
import { people } from '__test__/__mockData__/persons';
import { user } from '__test__/__mockData__/user';
import nock from 'nock';
import React from 'react';
import { Organization, PaymentHistory, mainStore } from 'store/main';
import { uiStore } from 'store/ui';
import OrganizationDetails from './OrganizationDetails';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useRouteMatch: () => ({ url: '', path: '' })
}));

const organization: Organization = {
  id: 'clrqpq84nncuuf32kh2g',
  name: 'test organization',
  description: 'test',
  github: 'https://github.com/stakwork',
  website: 'https://community.sphinx.chat',
  show: true,
  uuid: 'c360e930-f94d-4c07-9980-69fc428a994e',
  bounty_count: 1,
  budget: 100000,
  owner_pubkey: user.pubkey!,
  img: 'https://memes.sphinx.chat/public/3bt5n-7mGLgC6jGBBwKwLyZdJY6IUVZke8p2nLUsPhU=',
  created: '2023-12-12T00:44:25.83042Z',
  updated: '2023-12-12T01:12:39.970648Z',
  deleted: false
};

const roles = [
  {
      "name": "VIEW REPORT"
  }
]

const invoiceDetails = [
  {
    id: 1,
    amount: 10,
    bounty_id: 0,
    payment_type: 'withdraw',
    org_uuid: 'cn6pq4qtu2rj3nhh5kkg',
    sender_pubkey: '029a49ce2ec0885bd5edb09dbc4e4f700529dd76a7d19baab1656da61d909304c1',
    receiver_pubkey: '',
    created: '2024-02-15T05:24:13.021248Z',
    updated: '2024-02-15T05:24:13.021248Z',
    status: true,
    sender_name: 'test sender 1',
    receiver_name: '',
    sender_img: 'https://memes.sphinx.chat/public/o6xp_Ai9IdFEKMPNYE_QDF2MPoWHWuXn0pdlNgi12Gk=',
    receiver_img: ''
  },
  {
    id: 2,
    amount: 100,
    bounty_id: 0,
    payment_type: 'deposit',
    org_uuid: 'cn6pq4qtu2rj3nhh5kkg',
    sender_pubkey: '029a49ce2ec0885bd5edb09dbc4e4f700529dd76a7d19baab1656da61d909304c1',
    receiver_pubkey: '',
    created: '2024-02-15T05:22:33.451Z',
    updated: '2024-02-15T05:22:33.451Z',
    status: true,
    sender_name: 'test sender 2',
    receiver_name: '',
    sender_img: 'https://memes.sphinx.chat/public/o6xp_Ai9IdFEKMPNYE_QDF2MPoWHWuXn0pdlNgi12Gk=',
    receiver_img: ''
  },
  {
    id: 3,
    amount: 10,
    bounty_id: 0,
    payment_type: 'withdraw',
    org_uuid: 'cn6pq4qtu2rj3nhh5kkg',
    sender_pubkey: '029a49ce2ec0885bd5edb09dbc4e4f700529dd76a7d19baab1656da61d909304c1',
    receiver_pubkey: '',
    created: '2024-02-15T05:24:13.021248Z',
    updated: '2024-02-15T05:24:13.021248Z',
    status: true,
    sender_name: 'test sender 3',
    receiver_name: 'receiver 3',
    sender_img: 'https://memes.sphinx.chat/public/o6xp_Ai9IdFEKMPNYE_QDF2MPoWHWuXn0pdlNgi12Gk=',
    receiver_img: ''
  },
  {
    id: 4,
    amount: 10,
    bounty_id: 0,
    payment_type: 'payment',
    org_uuid: 'cn6pq4qtu2rj3nhh5kkg',
    sender_pubkey: '029a49ce2ec0885bd5edb09dbc4e4f700529dd76a7d19baab1656da61d909304c1',
    receiver_pubkey: '',
    created: '2024-02-15T05:24:13.021248Z',
    updated: '2024-02-15T05:24:13.021248Z',
    status: true,
    sender_name: 'test sender 4',
    receiver_name: 'receiver 4',
    sender_img: 'https://memes.sphinx.chat/public/o6xp_Ai9IdFEKMPNYE_QDF2MPoWHWuXn0pdlNgi12Gk=',
    receiver_img: ''
  }
] as PaymentHistory[];

let closeFn;
let resetOrgFn;
let getOrgFn;

beforeEach(() => {
  jest.spyOn(mainStore, 'getPersonAssignedBounties').mockReturnValue(Promise.resolve([]));
  jest.spyOn(mainStore, 'pollOrgBudgetInvoices').mockReturnValue(Promise.resolve([]));
  jest.spyOn(mainStore, 'organizationInvoiceCount').mockReturnValue(Promise.resolve(0));
  jest.spyOn(mainStore, 'getOrganizationUsers').mockReturnValue(Promise.resolve(people));
  jest.spyOn(mainStore, 'getUserRoles').mockReturnValue(Promise.resolve(roles));
  mainStore.bountyRoles = roles;
  uiStore.setMeInfo(user);
  jest
    .spyOn(mainStore, 'getOrganizationBudget')
    .mockReturnValue(Promise.resolve({ total_budget: 10000 }));
    jest.spyOn(mainStore, 'getPaymentHistories').mockReturnValue(Promise.resolve(invoiceDetails));
  resetOrgFn = jest.fn();
  closeFn = jest.fn();
  getOrgFn = jest.fn();
})


describe('OrganizationDetails', () => {
  jest.setTimeout(20000);
  nock.disableNetConnect();
  nock(user.url).get('/person/id/1').reply(200, { user });
  nock(user.url).get('/ask').reply(200, {});

  it('Should render history button on organization page', async () => {

    await act(async () => {
      const { getByTestId } = render(
        <OrganizationDetails
          close={closeFn}
          getOrganizations={getOrgFn}
          org={organization}
          resetOrg={resetOrgFn}
        />
      );
      getByTestId('organization-view-transaction-history-button');
    });
  });

  it('Should open history modal on click button', async () => {
    await act(async () => {
      const { getByTestId } = render(
        <OrganizationDetails
          close={closeFn}
          getOrganizations={getOrgFn}
          org={organization}
          resetOrg={resetOrgFn}
        />
      );
      getByTestId('organization-view-transaction-history-button').click();
      await waitFor(() => getByTestId('payment-history-modal'));
    });
  });

  it('Should render correct number of transaction in history modal', async () => {
    await act(async () => {
      const { getByTestId } = render(
        <OrganizationDetails
          close={closeFn}
          getOrganizations={getOrgFn}
          org={organization}
          resetOrg={resetOrgFn}
        />
      );
      getByTestId('organization-view-transaction-history-button').click();
      await waitFor(() => getByTestId('payment-history-modal'));
      for (let i = 0; i < invoiceDetails.length; i++) {
        await waitFor(() => getByTestId(`payment-history-transaction-${i}`));
      }
    });
  });

  it('Should render correct status of a transaction', async () => {
    await act(async () => {
      const { getByTestId } = render(
        <OrganizationDetails
          close={closeFn}
          getOrganizations={getOrgFn}
          org={organization}
          resetOrg={resetOrgFn}
        />
        );
        getByTestId('organization-view-transaction-history-button').click();
      await waitFor(async () => getByTestId('payment-history-modal'));
      await waitFor(async () => getByTestId(`payment-history-transaction-0`));
      expect(
      within(getByTestId('payment-history-transaction-0')
        ).getByTestId(
          'payment-history-transaction-type'
        ).innerHTML
      ).toBe('withdraw');

      expect(
        within(getByTestId('payment-history-transaction-1')).getByTestId(
          'payment-history-transaction-type'
        ).innerHTML
      ).toBe('deposit');
      expect(
        within(getByTestId('payment-history-transaction-3')).getByTestId(
          'payment-history-transaction-type'
        ).innerHTML
      ).toBe('payment');

    });
  });

  it('Should render correct transaction amount of a transaction', async () => {
    await act(async () => {
      const { getByTestId } = render(
        <OrganizationDetails
          close={closeFn}
          getOrganizations={getOrgFn}
          org={organization}
          resetOrg={resetOrgFn}
        />
      );
      getByTestId('organization-view-transaction-history-button').click();
      await waitFor(() => getByTestId('payment-history-modal'));
      await waitFor(()=>getByTestId(`payment-history-transaction-0`))

      expect(
        within(getByTestId('payment-history-transaction-0')).getByTestId(
          'payment-history-transaction-amount'
        )
      ).toHaveTextContent(`${invoiceDetails[0].amount} sats`);
      expect(
        within(getByTestId('payment-history-transaction-1')).getByTestId(
          'payment-history-transaction-amount'
        )
      ).toHaveTextContent(`${invoiceDetails[1].amount} sats`);
    });
  });

  it('Should render correct sender of a transaction', async () => {
    await act(async () => {
      const { getByTestId } = render(
        <OrganizationDetails
          close={closeFn}
          getOrganizations={getOrgFn}
          org={organization}
          resetOrg={resetOrgFn}
        />
      );
      getByTestId('organization-view-transaction-history-button').click();
      await waitFor(() => getByTestId('payment-history-modal'));
      await waitFor(() => getByTestId(`payment-history-transaction-0`));

      expect(
        within(getByTestId('payment-history-transaction-0')).getByTestId(
          'payment-history-transaction-sender'
        ).innerHTML
      ).toContain(invoiceDetails[0].sender_name);
    });
  });

  it('Should render correct receiver of a transaction', async () => {
    await act(async () => {
      const { getByTestId } = render(
        <OrganizationDetails
          close={closeFn}
          getOrganizations={getOrgFn}
          org={organization}
          resetOrg={resetOrgFn}
        />
      );
      getByTestId('organization-view-transaction-history-button').click();
      await waitFor(() => getByTestId('payment-history-modal'));
      expect(
        within(getByTestId('payment-history-transaction-3')).getByTestId(
          'payment-history-transaction-receiver'
        ).innerHTML
      ).toContain(invoiceDetails[3].receiver_name);
    });
  });

  it('Should redirect to correct url on selecting a transaction', async () => {
    const opeWindowFn = jest.fn();
    global.open = opeWindowFn;
    await act(async () => {
      const { getByTestId } = render(
        <OrganizationDetails
          close={closeFn}
          getOrganizations={getOrgFn}
          org={organization}
          resetOrg={resetOrgFn}
        />
      );
      getByTestId('organization-view-transaction-history-button').click();
      await waitFor(() => getByTestId('payment-history-modal'));
      within(getByTestId('payment-history-transaction-3'))
        .getByTestId('payment-history-transaction-link')
        .click();
      expect(opeWindowFn).toBeCalledWith(`/bounty/${invoiceDetails[3].bounty_id}`, "_blank");
    });
  });
  it('Should render all types of filter in history modal ', async () => {
    await act(async () => {
      const { getByTestId } = render(
        <OrganizationDetails
          close={closeFn}
          getOrganizations={getOrgFn}
          org={organization}
          resetOrg={resetOrgFn}
        />
      );
      getByTestId('organization-view-transaction-history-button').click();
      await waitFor(() => getByTestId('payment-history-modal'));
      getByTestId('payment-history-filter-type-payment');
      getByTestId('payment-history-filter-type-deposit');
      getByTestId('payment-history-filter-type-withdraw');
    });
  });
  it('Should render transaction according to the selected filter', async () => {
    await act(async () => {
      const { getByTestId } = render(
        <OrganizationDetails
          close={closeFn}
          getOrganizations={getOrgFn}
          org={organization}
          resetOrg={resetOrgFn}
        />
      );
      getByTestId('organization-view-transaction-history-button').click();
      await waitFor(() => getByTestId('payment-history-modal'));
      within(getByTestId('payment-history-filter-type-payment')).getByLabelText('Payments').click();
      within(getByTestId('payment-history-filter-type-deposit')).getByLabelText('Deposit').click();

      getByTestId('payment-history-filter-type-deposit');
      getByTestId('payment-history-filter-type-withdraw');
    });
  });

});
