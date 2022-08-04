import type { NextPage } from 'next';
import { Layout } from '@/components/Layout';
import { HeroSection, Carousel, PublishPromo, DiscoveryFooter } from '@valist/ui';
import { useMediaQuery } from '@mantine/hooks';

const Discover: NextPage = () => {
  const isMobile = useMediaQuery('(max-width: 900px)');
  const paddingY = isMobile ? '24px' : '64px';

  const demoItem1: any[] = [
    {
      img: 'https://gateway.valist.io/ipfs/QmXf81mLFFa1UA8QGMTU8a7kdFeNFmKytfZtTnutv9KVJN',
      name: 'Berty',
      description: 'A messenger that is as easy to use as it is secure.',
      link: '/berty/berty',
      type: 'Application',
    },
    {
      img: 'https://gateway.valist.io/ipfs/QmYRcBZuTswhDs63wnmpy3zszD3QUmDDR97dNJtXBdWf3t',
      name: 'Music3',
      description: 'Store music on IPFS in single Click.',
      link: '/0xdhruv/music3',
      type: 'Application',
    },
    {
      img: 'https://gateway.valist.io/ipfs/QmZxfFuW8knLCbMQMzjfM2s6piydLuD62GfXtTyenxVqBh',
      name: 'VoxelVerse',
      description: 'An open-world MetaVerse with a community driven game mechanic.',
      link: '/kbryan/hackfs2022',
      type: 'Game',
    },
    {
      img: 'https://gateway.valist.io/ipfs/QmWhnyhXb1ahhsuWBRvXdpNg51KH8f2zfkJyyhmpqBvuSa',
      name: 'Pap3rs',
      description: 'An easy mechanism for academics or researchers to publish research to IPFS.',
      link: '/chris13524/pap3rs',
      type: 'Application',
    },
    {
      img: "https://gateway.valist.io/ipfs/QmVoedSEuY4QJDhoHiJDFcAJ4L49UFjYmPoahsQfXYx3rp",
      name: 'Web3games',
      description: "A platform for developers to deploy and publish their browser based games.",
      link: '/maadhav/web3games',
      type: 'Application',
    },
    {
      img: 'https://gateway.valist.io/ipfs/QmbzQKtt2Z4EU5TdydM1pgxBvp1C1Sw57kXo7KyeZ11A9s',
      name: 'Shattered Realms',
      description: "A 90's style J-RPG inspired by the standard imposed by Square-Enix.",
      link: '/shatteredrealms/game',
      type: 'Game',
    },
  ];

  const demoItem2: any[] = [
    {
      img: 'https://pbs.twimg.com/profile_images/1499209010637152259/5ZYfm1jB_400x400.png',
      name: 'HashChat',
      description: 'An encrypted, cross-chain messaging platform built on web3 wallets.',
      link: '/max/hashchat',
      type: 'Application',
    },
    {
      img: 'https://gateway.valist.io/ipfs/QmX9CGE2cpG61ZDTRLijZZG2kXJnXoL6aUdVqVaNPJPsVr',
      name: 'Coinfight',
      description: 'An RTS where you fight over crypto.',
      link: '/coinop-logan/coinfight',
      type: 'Game',
    },
    {
      img: 'https://gateway.valist.io/ipfs/QmaPtGEpTsKub4ZfXiKzrF5YzqBkh9c4rVC5APr2yLSgJZ',
      name: 'Split/3',
      description: 'The web3 version of Splitwise',
      link: '/chris13524/split3',
      type: 'Application',
    },
    {
      img: 'https://gateway.valist.io/ipfs/QmaGDryDcRQqULRy8qqoiVNKLRwUGgZt8P9kYmCWSzcaqJ',
      name: 'MetaChess',
      description: 'Play and Earn:- Stake Crypto to play chess with friends and the winner takes all',
      link: '/metachess/metachessgame',
      type: 'Game',
    },
    {
      img: 'https://gateway.valist.io/ipfs/QmZfxfiHxPmJoGC8wgFbEr2mVXfrNzUnT8WYBeTiC5CEKq',
      name: 'ZenPond',
      description: 'Create a virtual pond and relax!',
      link: '/ivrl/zenpond',
      type: 'Game',
    },
    {
      img: 'https://gateway.valist.io/ipfs/QmcSDde1wEpeTFX8Zh6LQ1EGdQWcnHse7voXhw5JA8MjLS',
      name: 'Podcha',
      description: 'Find, collect and listen to the world’s best podcasts, on chain.',
      link: '/podcha/podcha',
      type: 'Website',
    },
    {
      img: 'https://gateway.valist.io/ipfs/QmaweTduZrSsejY2crbgBytBhDXxmzZHZ7NGPDBiqjuTEG',
      name: 'Mentor DAO',
      description: 'Mentors build a team with mentees to create real products earning real bounties.',
      link: '/yaron/mentordao',
      type: 'Application',
    },
    {
      img: 'https://gateway.valist.io/ipfs/QmV9n331gHhs87pwp5XXZ48ysQM5jKzKP7ovKTZ6nRPJaL',
      name: 'NFT Safe Launch',
      description: 'Create a smart contract that locks the funds of an ERC-721 until some condition is met.',
      link: '/nftsafelaunch/nftsafelaunch',
      type: 'Application',
    },
  ];
  
	return (
      <Layout hideNavbar={true} padding={0}>
         <section>
           <HeroSection
            image={"/images/discovery/shattered_realms.png"} 
            title={'Shattered Realms'} 
            tagline={'Action, Adventure, RPG'} 
            link={'/shatteredrealms/game'}
         /> 
         </section>
         
         <section style={{ marginTop: 56, padding: `0 ${paddingY}` }}>
            <Carousel title={"Popular Software"} number={5} items={demoItem1} />
         </section>

         <section style={{ marginTop: 56, padding: `0 ${paddingY}` }}>
            <Carousel title={"New on Valist"} number={5} items={demoItem2} />
         </section>

         <section>
            <PublishPromo />
         </section>
         
         <section>
            <DiscoveryFooter />
         </section>
      </Layout>
	);
};

export default Discover;
