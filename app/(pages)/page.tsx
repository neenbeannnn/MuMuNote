"use client";
import { useEffect } from "react";
import Login from "./login/page";
import {supabase} from '../lib/supabaseClient';

export default function Home() {
  useEffect(() => {
    const connection = async() => {
      const {data, error} = await supabase.from('Profiles').select('*');
      console.log("data:", data);
      console.log("error: ", error);
    };

    connection();
  }, []);

  return (
    <div>
      <Login/>
    </div>
  );
}