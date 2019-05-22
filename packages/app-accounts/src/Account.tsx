// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ActionStatus } from '@polkadot/ui-app/Status/types';
import { I18nProps } from './types';

import { Button as SUIB, Popup } from 'semantic-ui-react';
import React from 'react';
import styled from 'styled-components';
import { AddressSummary, Available, Balance, Bonded, CryptoType, Nonce, Unlocking } from '@polkadot/ui-app';
import keyring from '@polkadot/ui-keyring';

import Backup from './modals/Backup';
import ChangePass from './modals/ChangePass';
import Forgetting from './modals/Forgetting';
import translate from './translate';

type Props = I18nProps & {
  address: string
};

type State = {
  isBackupOpen: boolean,
  isForgetOpen: boolean,
  isPasswordOpen: boolean
};

const Wrapper = styled.article`
  position: relative;
  flex: 1 1;
  min-width: 24%;
  max-width: 24%;
  justify-content: space-around;

  .accounts--Account-buttons {
    text-align: right;
    margin-bottom: 2em;
  }

  .ui--AddressSummary {
    justify-content: space-around;
  }

  .ui--AddressSummary-base {
    flex: 1;
    padding: 0;
  }
  .ui--AddressSummary-children {
    flex: 1;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
  }

  .account--Account-balances {
    display: grid;
    grid-column-gap: .5em;
    color: #4e4e4e;
    opacity: 1;
  }

  .label-available,
  .label-balance,
  .label-bonded,
  .label-cryptotype,
  .label-locked,
  .label-nonce,
  .label-redeemable {
    grid-column:  1;
    text-align: right;
  }

  .result-available,
  .result-balance,
  .result-bonded,
  .result-cryptotype,
  .result-locked,
  .result-nonce,
  .result-redeemable {
    grid-column:  2;
  }

  .accounts--Account-buttons > button {
    margin: .2em;
  }

  @media (max-width: 2060px) {
    min-width: 32%;
    max-width: 32%;
  }

  @media (max-width: 1580px) {
      min-width: 49%;
      max-width: 49%;
  }

  @media (max-width: 1100px) {
    min-width: 100%;
    max-width: 100%;
  }
`;

class Account extends React.PureComponent<Props> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      isBackupOpen: false,
      isForgetOpen: false,
      isPasswordOpen: false
    };
  }

  render () {
    const { address } = this.props;

    return (
      <Wrapper className='overview--Account'>
        {this.renderModals()}
        <AddressSummary
          value={address}
          identIconSize={96}
          isEditable
          withBalance={false}
          withNonce={false}
          withTags
        >
          <div className='account--Account-expand'>
            {this.renderButtons()}
            <div className='account--Account-balances'>
              {this.renderTotal()}
              {this.renderAvailable()}
              {this.renderBonded()}
              {this.renderUnlocking()}
              <br/>
              {this.renderNonce()}
              {this.renderCryptoType()}
            </div>
          </div>
        </AddressSummary>
      </Wrapper>
    );
  }

  private renderAvailable () {
    const { address, t } = this.props;

    return (
      <Available
        className='accounts--Account-balances-available'
        label={t('available')}
        params={address}
      />
    );
  }

  private renderBonded () {
    const { address, t } = this.props;

    return (
      <Bonded
        className='accounts--Account-balances-bonded'
        label={t('bonded')}
        params={address}
      />
    );
  }

  private renderCryptoType () {
    const { address, t } = this.props;

    return (
      <CryptoType
        accountId={address}
        className='accounts--Account-details-crypto'
        label={t('crypto type')}
      />
    );
  }

  private renderModals () {
    const { address } = this.props;
    const { isBackupOpen, isForgetOpen, isPasswordOpen } = this.state;

    if (!address) {
      return null;
    }

    const modals = [];

    if (isBackupOpen) {
      modals.push(
        <Backup
          key='modal-backup-account'
          onClose={this.toggleBackup}
          address={address}
        />
      );
    }

    if (isForgetOpen) {
      modals.push(
        <Forgetting
          address={address}
          doForget={this.onForget}
          key='modal-forget-account'
          onClose={this.toggleForget}
        />
      );
    }

    if (isPasswordOpen) {
      modals.push(
        <ChangePass
          address={address}
          key='modal-change-pass'
          onClose={this.togglePass}
        />
      );
    }

    return modals;
  }

  private toggleBackup = (): void => {
    const { isBackupOpen } = this.state;

    this.setState({
      isBackupOpen: !isBackupOpen
    });
  }

  private toggleForget = (): void => {
    const { isForgetOpen } = this.state;

    this.setState({
      isForgetOpen: !isForgetOpen
    });
  }

  private togglePass = (): void => {
    const { isPasswordOpen } = this.state;

    this.setState({
      isPasswordOpen: !isPasswordOpen
    });
  }

  private onForget = (): void => {
    const { address, t } = this.props;

    if (!address) {
      return;
    }

    const status = {
      account: address,
      action: 'forget'
    } as ActionStatus;

    try {
      keyring.forgetAccount(address);
      status.status = 'success';
      status.message = t('account forgotten');
    } catch (error) {
      status.status = 'error';
      status.message = error.message;
    }
  }

  private renderNonce () {
    const { address, t } = this.props;

    return (
      <Nonce
        className='accounts--Account-details-nonce'
        params={address}
        label={t('transactions')}
      />
    );
  }

  private renderTotal () {
    const { address, t } = this.props;

    return (
      <Balance
        className='accounts--Account-balances-balance'
        label={t('total')}
        params={address}
      />
    );
  }

  private renderUnlocking () {
    const { address } = this.props;

    return (
      <Unlocking
        className='accounts--Account-balances-unlocking'
        params={address}
      />
    );
  }

  private renderButtons () {

    // FIXME: The <Popup /> event trigger on='hover' does not work together with the ui-app'
    // <Button /> component. That's why the original Semantic UI component is being used here.
    return (
      <div className='accounts--Account-buttons'>
        <Popup
          content='Delete this account'
          trigger={
            <SUIB
              negative
              onClick={this.toggleForget}
              icon='trash'
              size='small'
            />
          }
          wide='very'
        />
        <Popup
          content='Create a backup file for this account'
          trigger={
            <SUIB
              icon='cloud download'
              onClick={this.toggleBackup}
              size='small'
            />
          }
        />
        <Popup
          content="Change this account's password"
          trigger={
            <SUIB
              icon='key'
              onClick={this.togglePass}
              size='small'
            />
          }
        />
      </div>
    );
  }
}

export default translate(Account);