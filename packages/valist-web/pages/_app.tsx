import '../styles/globals.css';
import type { AppProps } from 'next/app';
import getConfig from 'next/config';
import React, { useEffect, useState } from 'react';
import { Client } from '@valist/sdk';
import { ethers } from 'ethers';
import { ApolloProvider } from '@apollo/client';
import { Magic } from 'magic-sdk';
import toast, { Toaster } from "react-hot-toast";

import AccountContext from '../components/Accounts/AccountContext';
import ValistContext, { createValistClient, defaultProvider  } from '../components/Valist/ValistContext';
import { LoginType, ValistProvider } from '../utils/Account/types';
import { login, onAccountChanged } from '../utils/Account/index';
import LoginForm from '../components/Accounts/LoginForm';
import { newMagic } from '../utils/Providers';
import client from "../utils/Apollo/client";
import Modal from '../components/Modal';

function ValistApp({ Component, pageProps }: AppProps) {
  const { publicRuntimeConfig } = getConfig();
  const [provider, setProvider] = useState<ValistProvider>(defaultProvider);
  const [valistClient, setValistClient] = useState<Client>(createValistClient(
    publicRuntimeConfig.CHAIN_ID,
    publicRuntimeConfig.METATX_ENABLED,
    publicRuntimeConfig.IPFS_HOST,
    publicRuntimeConfig.IPFS_GATEWAY,
    provider
  ));
  const [magic, setMagic] = useState<Magic | null>(null);
  const [address, setAddress] = useState<string>('0x0');
  const [loginType, setLoginType] = useState<LoginType>('readOnly');
  const [showLogin, setShowLogin] = useState(false);
  const [modal, setModal] = useState<boolean>(false);
  const [mainnet, setMainnet] = useState<ethers.providers.JsonRpcProvider>(new ethers.providers.JsonRpcProvider('https://rpc.valist.io/mainnet'));

  const notify = (type: string, text?: string): string => {
    switch (type) {
      case 'transaction':
        return toast.custom(() => (
          <div className='toast'>
           Transaction pending: <a className="text-indigo-500 cursor-pointer" target="_blank" rel="noreferrer" href={`https://mumbai.polygonscan.com/tx/${text}`}>view on block explorer </a>
          </div>
        ), {
          position: 'top-right',
          duration: 1000000,
        });
      case 'pending':
        return toast.custom(() => (
          <div className='toast'>
           Creating transaction..
          </div>
        ), {
          position: 'bottom-center',
          duration: 1000000,
        });
      case 'message':
        return toast.success(`${text}`, {
          position: 'top-right',
        });
      case 'success':
        return toast.success('Transaction Successfull!', {
          position: 'top-right',
        });
      case 'error':
        return toast(`${text}`, {
          position: 'top-right',
          style: {
            backgroundColor: '#ff6961',
            wordBreak: 'break-word',
            overflow: 'hidden',
          },
        });
    }
    return '';
  };

  const dismiss = (id: string) => {
    toast.dismiss(id);
  };

  const resolveEns = async (address:string) => {
    if (address?.length > 10) {
      try {
        const name = await mainnet.lookupAddress(address);
        if (name !== null) {
          return name;
        }
      } catch (err) {
        console.log(err);
      }
    }
    return null;
  };
  
  const accountState = {
    magic,
    address,
    loginType,
    modal,
    resolveEns,
    setLoginType,
    setShowLogin,
    setAddress,
    setMagic,
    notify,
    dismiss,
    setModal,
  };

  useEffect(() => {
    setMagic(newMagic());
  }, [setMagic]);

  useEffect(() => {
    const _loginType = (localStorage.getItem('loginType') as LoginType) || 'readOnly';
  
    login(_loginType, setLoginType, setProvider, setAddress, setMagic, '');
    onAccountChanged(setLoginType, setProvider, setAddress, '');
  }, []);

  useEffect(() => {
    setValistClient(createValistClient(
      publicRuntimeConfig.CHAIN_ID,
      publicRuntimeConfig.METATX_ENABLED,
      publicRuntimeConfig.IPFS_HOST,
      publicRuntimeConfig.IPFS_GATEWAY,
      provider
    ));
  }, [provider, publicRuntimeConfig.CHAIN_ID, publicRuntimeConfig.IPFS_HOST, publicRuntimeConfig.METATX_ENABLED]);

  useEffect(() => {
    // @ts-ignore
    window.valist = valistClient;
  }, [valistClient]);

  useEffect(() => console.log("Address:", address), [address]);

  return (
    <ApolloProvider client={client}>
      <AccountContext.Provider value={accountState}>
        <ValistContext.Provider value={valistClient}>
          <Component {...pageProps} />
          {showLogin && <LoginForm 
            setProvider={setProvider}
            setAddress={setAddress}
          />}
          <Toaster />
          <Modal setOpen={setModal} open={modal} />
        </ValistContext.Provider>
      </AccountContext.Provider>
    </ApolloProvider>
  );
}

export default ValistApp;
