"use client";

import "../../apps/pidieffe-fe/src/index.css";
import PidieffeApp from "../../apps/pidieffe-fe/src/App";
import { DocumentProvider } from "../../apps/pidieffe-fe/src/context/DocumentContext";
import { UiProvider } from "../../apps/pidieffe-fe/src/context/UiContext";

export default function Pidieffe() {
  return (
    <DocumentProvider>
      <UiProvider>
        <PidieffeApp logoSrc="/app-icons/pidieffe.png" />
      </UiProvider>
    </DocumentProvider>
  );
}
