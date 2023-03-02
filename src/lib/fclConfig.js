// lib/web3/fcl/config.js
import {config} from "@onflow/fcl"


config({
  "flow.network": "testnet", //remove this line for mainnet
  'discovery.wallet': process.env.NEXT_PUBLIC_TESTNET_WALLET_DISCOVERY, //prod: process.env.NEXT_PUBLIC_DAPPER_WALLET_DISCOVERY,
  'accessNode.api': process.env.NEXT_PUBLIC_FLOW_TESTNET, //prod: process.env.NEXT_PUBLIC_FLOW_ACCESS_NODE,
	'app.detail.title': process.env.NEXT_PUBLIC_APP_NAME,
	'app.detail.icon': process.env.NEXT_PUBLIC_APP_ICON,
})