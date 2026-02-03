declare module 'html5-qrcode' {
  export interface Html5QrcodeResult {
    decodedText: string
    result: {
      text: string
      format: {
        format: number
        formatName: string
      }
    }
  }

  export interface Html5QrcodeConfig {
    fps?: number
    qrbox?: number | { width: number; height: number }
    aspectRatio?: number
    disableFlip?: boolean
    videoConstraints?: MediaTrackConstraints
  }

  export interface CameraDevice {
    id: string
    label: string
  }

  export class Html5Qrcode {
    constructor(elementId: string, verbose?: boolean)

    start(
      cameraIdOrConfig: string | { facingMode: string },
      configuration: Html5QrcodeConfig | undefined,
      qrCodeSuccessCallback: (decodedText: string, decodedResult: Html5QrcodeResult) => void,
      qrCodeErrorCallback?: (errorMessage: string) => void
    ): Promise<null>

    stop(): Promise<void>

    clear(): void

    getState(): number

    static getCameras(): Promise<CameraDevice[]>
  }

  export class Html5QrcodeScanner {
    constructor(
      elementId: string,
      config: Html5QrcodeConfig | undefined,
      verbose?: boolean
    )

    render(
      qrCodeSuccessCallback: (decodedText: string, decodedResult: Html5QrcodeResult) => void,
      qrCodeErrorCallback?: (errorMessage: string) => void
    ): void

    clear(): void
  }
}
