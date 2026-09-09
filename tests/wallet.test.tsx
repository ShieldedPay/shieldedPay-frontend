import React from "react"
import { describe, it, expect } from "vitest"
import { render, screen, act } from "@testing-library/react"
import { WalletProvider, useWallet } from "@/contexts/wallet-context"

function WalletTester() {
  const { wallet, connect, disconnect, switchNetwork } = useWallet()

  return (
    <div>
      <span data-testid="status">{wallet.isConnected ? "connected" : "disconnected"}</span>
      <span data-testid="type">{wallet.walletType || "none"}</span>
      <span data-testid="network">{wallet.network}</span>
      <span data-testid="address">{wallet.address || "none"}</span>
      <button onClick={() => connect("xBull")}>Connect xBull</button>
      <button onClick={() => connect("Freighter")}>Connect Freighter</button>
      <button onClick={() => switchNetwork("mainnet")}>Switch Mainnet</button>
      <button onClick={disconnect}>Disconnect</button>
    </div>
  )
}

describe("Stellar Wallet Context", () => {
  it("initializes with default disconnected testnet state", () => {
    render(
      <WalletProvider>
        <WalletTester />
      </WalletProvider>
    )

    expect(screen.getByTestId("status").textContent).toBe("disconnected")
    expect(screen.getByTestId("type").textContent).toBe("none")
    expect(screen.getByTestId("network").textContent).toBe("testnet")
  })

  it("connects to specified Stellar wallet and generates address", async () => {
    render(
      <WalletProvider>
        <WalletTester />
      </WalletProvider>
    )

    await act(async () => {
      screen.getByText("Connect xBull").click()
    })

    expect(screen.getByTestId("status").textContent).toBe("connected")
    expect(screen.getByTestId("type").textContent).toBe("xBull")
    expect(screen.getByTestId("address").textContent).toMatch(/^G[A-Z2-7]{55}$/)
  })

  it("allows network switching and handles disconnect", async () => {
    render(
      <WalletProvider>
        <WalletTester />
      </WalletProvider>
    )

    await act(async () => {
      screen.getByText("Connect Freighter").click()
    })

    expect(screen.getByTestId("type").textContent).toBe("Freighter")

    await act(async () => {
      screen.getByText("Switch Mainnet").click()
    })
    expect(screen.getByTestId("network").textContent).toBe("mainnet")

    await act(async () => {
      screen.getByText("Disconnect").click()
    })
    expect(screen.getByTestId("status").textContent).toBe("disconnected")
    expect(screen.getByTestId("type").textContent).toBe("none")
  })
})
