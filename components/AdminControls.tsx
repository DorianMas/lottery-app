import { ArrowPathIcon, ArrowUturnDownIcon, CurrencyDollarIcon, StarIcon } from '@heroicons/react/24/solid'
import React from 'react'
import {
  useAddress,
  useContract,
  useContractData,
  useContractCall,
} from "@thirdweb-dev/react";
import { currency } from '../constants';
import {ethers} from "ethers"
import toast from 'react-hot-toast';

function AdminControls() {
      const { contract, isLoading } = useContract(
    "0x4deB6431dFB56E38e8fAff4662374a2b86d92fb1"
  );

  const {data: totalCommission} = useContractData(contract, "operatorTotalCommission");
  const { mutateAsync: RefundAll } = useContractCall(contract, "RefundAll");
  const { mutateAsync: restartDraw } = useContractCall(contract, "restartDraw");
  const { mutateAsync: WithdrawCommission } = useContractCall(contract, "WithdrawCommission");
  const { mutateAsync: DrawWinnerTicker} = useContractCall(contract, "DrawWinnerTicker")


  const refundingAll = async () => {
     const notification = toast.loading('Refunding all...');
    try {
      const data = await RefundAll([{}]);

            toast.success("All refunded successfully !", {
        id: notification,
      });
    } catch (error) {
      toast.error("Whoops something went wrong!", {
        id: notification,
      });
      console.error("contract call failure", error);
    }
  }

  const withdrawCommission =async () => {
       const notification = toast.loading('Withdrawing Commission...');
    try {
      const data = await WithdrawCommission([{}]);

            toast.success("Your Commission has been withdrawn successfully!", {
        id: notification,
      });
    } catch (error) {
      toast.error("Whoops something went wrong!", {
        id: notification,
      });
      console.error("contract call failure", error);
    }
  }

  const onRestartDraw = async () => {
     const notification = toast.loading('Restarting draw...');
    try {
      const data = await restartDraw([{}]);

            toast.success("Draw restarted successfully!", {
        id: notification,
      });
    } catch (error) {
      toast.error("Whoops something went wrong!", {
        id: notification,
      });
      console.error("contract call failure", error);
    }
  }

  const drawWinner = async () => {
     const notification = toast.loading('Picking a lucky winner...');
    try {
      const data = await DrawWinnerTicker([{}]);

            toast.success("A winner has been selected!", {
        id: notification,
      });
    } catch (error) {
      toast.error("Whoops something went wrong!", {
        id: notification,
      });
      console.error("contract call failure", error);
    }
  }

  return (
    <div className='text-white text-center px-5 py-3 rounded-md border-emerald-300/20 border'>
        <h2 className='font-bold'>Admin Controls</h2>
        <p className='mb-5'>Total Commission to be withdrawn:{" "}{totalCommission && ethers.utils.formatEther(totalCommission?.toString())}{" "}{currency}</p>
        <div className='flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2'>
            <button onClick={drawWinner} className='admin-button'><StarIcon className='h-6 mx-auto mb-2'/> Draw Winner</button>
            <button onClick={withdrawCommission} className='admin-button'><CurrencyDollarIcon className='h-6 mx-auto mb-2'/>Withdraw Commission</button>
            <button onClick={onRestartDraw} className='admin-button'><ArrowPathIcon className='h-6 mx-auto mb-2'/> Restart the Draw</button>
            <button onClick={refundingAll} className='admin-button'><ArrowUturnDownIcon className='h-6 mx-auto mb-2'/> Refund All</button>
        </div>
    </div>
  )
}

export default AdminControls