import { CreateJettonDemo } from "../CreateJettonDemo/CreateJettonDemo";
import { Footer } from "../Footer/Footer";
import { Header } from "../Header/Header";
import { MerkleExample } from "../MerkleExample/MerkleExample";
import { SignDataTester } from "../SignDataTester/SignDataTester";
import { TonProofDemo } from "../TonProofDemo/TonProofDemo";
import { TxForm } from "../TxForm/TxForm";
import { WalletBatchLimitsTester } from "../WalletBatchLimitsTester/WalletBatchLimitsTester";
import './style.scss';

export function OldPage() {
  return (
    <div className="old-page">
      <Header />
      <TxForm />
      <WalletBatchLimitsTester />
      <SignDataTester />
      <CreateJettonDemo />
      <TonProofDemo />
      <MerkleExample />
      <Footer />
    </div>
  );
} 