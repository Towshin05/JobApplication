import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

const Success = () => {
    return (
        <div className='m-0 p-0'>
            <div className='w-full min-h-[80vh] flex flex-col justify-center items-center'>
                <div className='my-10 text-green-600 text-2xl mx-auto flex flex-col justify-center items-center'>
                    <img src="/images/success.png" alt="" width={220} height={220} />
                    <h3 className='text-4xl pt-20 lg:pt-0 font-bold text-center text-slate-700'>
                        Payment Successful
                    </h3>
                    <button onClick={() => { window.location.href = '/' }}
                        className='w-40 uppercase bg-[#009C96] text-white text-xl my-16 px-2 py-2 rounded'
                    >
                        Proceed
                    </button>
                </div>
            </div>
        </div >
    );
};

export default Success;