import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Header from "../components/Header";
import Login from "../components/Login";
import {
  useAddress,
  useContract,
  useContractData,
  useContractCall,
} from "@thirdweb-dev/react";
import Loading from "../components/Loading";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { currency } from "../constants";
import CountDownTimer from "../components/CountDownTimer";
import toast from "react-hot-toast";
import Marquee from "react-fast-marquee";
import AdminControls from "../components/AdminControls";

const Home: NextPage = () => {
  const address = useAddress();
  const [userTickets, setUserTickets] = useState(0);

  const { contract, isLoading } = useContract(
    "0x4deB6431dFB56E38e8fAff4662374a2b86d92fb1"
  );
  console.log(contract);
  const { data: remainingTickets } = useContractData(
    contract,
    "RemainingTickets"
  );
  console.log(remainingTickets);

  const { data: currentWinningReward } = useContractData(
    contract,
    "CurrentWinningReward"
  );
  console.log(currentWinningReward);

  const { data: ticketCommission } = useContractData(
    contract,
    "ticketCommission"
  );

  const { data: ticketPrice } = useContractData(contract, "ticketPrice");

  const { data: expiration } = useContractData(contract, "expiration");

  const { mutateAsync: BuyTickets } = useContractCall(contract, "BuyTickets");

  const { data: tickets } = useContractData(contract, "getTickets");

  const {data: winnings} = useContractData(contract, "getWinningsForAddress", address);
  console.log(winnings)

  const { mutateAsync: WithdrawWinnings } = useContractCall(contract, "WithdrawWinnings")

  const {data: lastWinner} = useContractData(contract, "lastWinner");
  const {data: lastWinnerAmount} = useContractData(contract, "lastWinnerAmount")
  const [quantity, setQuantity] = useState<number>(1);


  const onWithdrawWinnings = async () => {
    const notification = toast.loading('Withdrawing winnings...');
    try {
      const data = await WithdrawWinnings([{}]);

            toast.success("Winnings withdrawn successfully!", {
        id: notification,
      });
    } catch (error) {
      toast.error("Whoops something went wrong!", {
        id: notification,
      });
      console.error("contract call failure", error);
    }
  }

  const {data: isLotteryOperator} = useContractData(contract, "lotteryOperator")
  useEffect(() => {
    if (!tickets) return;

    const totalTickets: string[] = tickets;

    const noOfUserTickets = totalTickets.reduce(
      (total, ticketAddress) => (ticketAddress === address ? total + 1 : total),
      0
    );
    setUserTickets(noOfUserTickets);
    console.log("number of tickets:", tickets)
  }, [tickets, address]);

  const handleClick = async () => {
    if (!ticketPrice) return;
    const notification = toast.loading("Buying your tickets...");
    try {
      const data = await BuyTickets([
        {
          value: ethers.utils.parseEther(
            (
              Number(ethers.utils.formatEther(ticketPrice)) * quantity
            ).toString()
          ),
        },
      ]);
      toast.success("Tickets purchased successfully!", {
        id: notification,
      });
      console.log(data);
    } catch (error) {
      toast.error("Whoops something went wrong!", {
        id: notification,
      });
      console.error("contract call failure", error);
    }
  };

  if (isLoading) return <Loading />;

  if (!address) return <Login />;

  return (
    <div className="bg-[#091B18] min-h-screen flex flex-col">
      <Head>
        <title>The crypto lottery</title>
      </Head>
      <Header/>

      <Marquee className="bg-[#0A1F1C] p-5 m-5" gradient={false} speed={100}>
        <div className="flex space-x-2 mx-10">
          <h4 className="text-white">Last Winner:{" "}{lastWinner?.toString()}</h4>
          <h4 className="text-white">Previous winnings:{" "}{lastWinnerAmount && ethers.utils.formatEther(lastWinnerAmount?.toString())}{" "}{currency}</h4>
        </div>
      </Marquee>

      {isLotteryOperator === address && (
        <div className="flex justify-center">
          <AdminControls/>
        </div>
      )}
      
      {winnings > 0 && (
        <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto mt-5">
        <button onClick={onWithdrawWinnings} className="p-5 bg-gradient-to-b from-orange-500 to-emerald-600 animate-pulse text-center rounded-xl w-full">
          <p className="font-bold">Winner Winner Chicken Dinner!</p>
          <p>Total winnings:{" "}{ethers.utils.formatEther(winnings.toString())}{" "}{currency }</p>
          <br/>
          <p className="font-semibold">Click here to withdraw</p>
        </button>
        </div>
      )}
      
      {/*The Next Draw Box*/}
      <div className="flex justify-center">
        <div className="space-y-5 md:space-y-0 m-5 md:flex md:flex-row items-start gap-4">
          <div className="stats-container flex-3">
            <h1 className="text-5xl text-white font-semibold text-center">
              The Next Draw
            </h1>
            <div className="flex justify-between p-2 space-x-2">
              <div className="stats">
                <h2 className="text-sm">Total Pool</h2>
                <p className="text-xl ">
                  {currentWinningReward &&
                    ethers.utils.formatEther(
                      currentWinningReward?.toString()
                    )}{" "}
                  {currency}
                </p>
              </div>
              <div className="stats">
                <h2 className="text-sm">Ticket Remaining</h2>
                <p className="text-xl ">{remainingTickets?.toNumber()}</p>
              </div>
            </div>
            {/*Countdown*/}
            <div className="mt-5 mb-3">
              <CountDownTimer />
            </div>
          </div>
          <div className="stats-container space-y-2">
            <div className="stats-container">
              <div className="flex justify-between items-center text-white pb-2">
                <h2>Price per ticket</h2>
                <p>0.01 MATIC</p>
              </div>
              <div className="flex text-white items-center space-x-2 bg-[#091B1B] border-[#004337] border p-4">
                <p>TICKETS</p>
                <input
                  type="number"
                  className="flex w-full bg-transparent text-right outiline-none"
                  min={1}
                  max={10}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2 mt-5">
                <div className="flex items-center justify-between text-emerald-300 text-sm italic font-extrabold">
                  <p>Total cost of tickets</p>
                  <p>
                    {ticketPrice &&
                      Number(ethers.utils.formatEther(ticketPrice.toString())) *
                        quantity}
                  </p>
                </div>
                <div className="flex items-center justify-between text-emerald-300 text-xs italic">
                  <p>Service fees</p>
                  <p>
                    {ticketCommission &&
                      ethers.utils.formatEther(
                        ticketCommission?.toString()
                      )}{" "}
                    {currency}
                  </p>
                </div>
                <div className="flex items-center justify-between text-emerald-300 text-xs italic">
                  <p>+ Network fees</p>
                  <p>TBC</p>
                </div>
              </div>
              <button
                disabled={
                  expiration?.toString() < Date.now().toString() ||
                  remainingTickets?.toNumber() === 0
                }
                onClick={handleClick}
                className="mt-5 w-full bg-gradient-to-br from-orange-500 to-emerald-600 px-10 py-5 rounded-md text-white shadow-xl disabled:from-gray-600 disabled:to-gray-600 disabled:text-gray-100 disabled:cursor-not-allowed font-semibold"
              >
                Buy {quantity} tickets for{" "}
                {ticketPrice &&
                  Number(ethers.utils.formatEther(ticketPrice.toString())) *
                    quantity}{" "}
                {currency}
              </button>
            </div>
          
          {userTickets > 0 && (<div className="stats">
            <p className="text-lg mb-2">You have {userTickets} Tickets in this draw</p>
          <div className="flex max-w-sm flex-wrap gap-x-2 gap-y-2">
          {Array(userTickets).fill("").map((_, index) =>(
            <p key={index} className='text-emerald-300 h-20 w-12 bg-emerald-500/30 rounded-lg flex flex-shrink-0 items-center justify-center text-xs italic'>{index + 1}</p>
          ))}
          </div>
        </div>
        )}
        </div>
        {/*The price per ticket Box*/}
      </div>
    </div>
 </div>

  );
};

export default Home;
