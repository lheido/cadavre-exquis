import { useNavigate } from "@solidjs/router";
import {
  Html5QrcodeScanner,
  QrcodeErrorCallback,
  QrcodeSuccessCallback,
} from "html5-qrcode";
import {
  Component,
  ComponentProps,
  createSignal,
  onMount,
  splitProps,
} from "solid-js";

type QRCodeScannerProps = ComponentProps<"div">;

const QRCodeScanner: Component<QRCodeScannerProps> = (
  props: QRCodeScannerProps
) => {
  let containerRef!: HTMLDivElement;
  let scanner: Html5QrcodeScanner;
  const [classes] = splitProps(props, ["class", "classList"]);
  const navigate = useNavigate();
  const [error, setError] = createSignal("");

  const onScanSuccess: QrcodeSuccessCallback = (decodedText: string) => {
    if (decodedText.includes("/room/")) {
      const id = decodedText.split("/room/")?.[1];
      if (id) {
        scanner.pause();
        scanner.clear();
        navigate(`/room/${id}`);
      }
    }
  };

  const onScanFailure: QrcodeErrorCallback = (error) => {
    setError(error);
  };

  onMount(() => {
    scanner = new Html5QrcodeScanner(
      "qrcode-scanner",
      { fps: 10, qrbox: { width: 300, height: 300 } },
      false
    );
    scanner.render(onScanSuccess, onScanFailure);
  });

  return (
    <div class={classes.class} classList={classes.classList}>
      <div id="qrcode-scanner" />
    </div>
  );
};

export default QRCodeScanner;
