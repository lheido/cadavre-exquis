import QRCode from "qrcode";
import {
  Component,
  ComponentProps,
  Show,
  createSignal,
  onMount,
  splitProps,
} from "solid-js";
import { twMerge } from "tailwind-merge";

type QrCodeViewProps = ComponentProps<"section">;

const QrCodeView: Component<QrCodeViewProps> = (props: QrCodeViewProps) => {
  const [classes, others] = splitProps(props, ["class", "classList"]);
  const [qrcodeUrl, setQrCodeUrl] = createSignal("");
  onMount(() => {
    // Prevent wrong window.location.href on component mount
    setTimeout(async () => {
      try {
        const url = await QRCode.toDataURL(window.location.href, {
          errorCorrectionLevel: "H",
        });
        setQrCodeUrl(url);
      } catch {}
    });
  });
  return (
    <Show when={qrcodeUrl() !== ""}>
      <section
        class={twMerge("flex justify-center items-center", classes.class)}
        classList={classes.classList}
      >
        <img src={qrcodeUrl()} alt="QRCode" class="rounded-xl" />
      </section>
    </Show>
  );
};

export default QrCodeView;
