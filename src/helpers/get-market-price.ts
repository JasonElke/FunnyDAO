import { ethers } from 'ethers'
import { LpReserveContract } from '../abi'
import { mimMaia } from '../helpers/bond'
import { Networks } from '../constants/blockchain'

export async function getMarketPrice(
  networkID: Networks,
  provider: ethers.Signer | ethers.providers.Provider,
): Promise<number> {
  const mimMaiaAddress = mimMaia.getAddressForReserve(networkID)
  const pairContract = new ethers.Contract(
    mimMaiaAddress,
    LpReserveContract,
    provider,
  )
  const reserves = await pairContract.getReserves()
  const marketPrice = (reserves[1].toString() / 1e18) / (reserves[0].toString() / 1e9)
  
  return marketPrice
}
