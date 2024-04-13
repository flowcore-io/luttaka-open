// dymo-sdk.d.ts
declare namespace dymo {
  namespace label {
    namespace framework {
      function init(callback: () => void): void
      function checkEnvironment(): {
        isFrameworkInstalled: boolean
        isBrowserSupported: boolean
      }
      function getPrinters(): Array<{
        name: string
        model?: string
        isConnected?: boolean
      }>
      function printLabel(
        printerName: string,
        printParamsXml: string | null,
        labelXml: string,
        labelSetXml: string | null,
      ): void
    }
  }
}
