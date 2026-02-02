"use client"
import { useState } from "react";

export default function Home() {
  const user = {
    name: "Gonza",
    balance: 0
  }
  return (
    <div className="flex-col min-h-screen items-center justify-center align-center p-4 bg-zinc-50 font-sans dark:bg-black">
      <header>
        <h1>Gastos y ahorros</h1>
        <p>Bienvenido, {user.name}!</p>
        <h2>Tu balance es {user.balance}</h2>
      </header>

      <main className="flex justify-evenly">
        <ul>
          <li>
            <h3>Efectivo</h3>
            <div><div className="contador">
      <button className="btn-menos">-</button>
      <span className="numero">0</span>
      <button className="btn-mas">+</button>
    </div> de 10mil</div>
            <p></p>
          </li>
          <li>

          </li>
          <li>

          </li>
        </ul>
      </main>

      <footer>
      </footer>
    </div>
  );
}
