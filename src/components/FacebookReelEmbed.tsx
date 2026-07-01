interface FacebookReelEmbedProps {
  src: string;
  title: string;
  caption: string;
  containerClass?: string;
  cardClass?: string;
}

export default function FacebookReelEmbed({ src, title, caption, containerClass, cardClass }: FacebookReelEmbedProps) {
  return (
    <figure className={`mx-auto w-full max-w-[330px] rounded-[28px] bg-[#FFFDF8] p-3 shadow-[0_18px_50px_rgba(74,47,36,0.14)] ${containerClass || ''}`}>
      <div className={`aspect-[9/16] overflow-hidden rounded-[22px] bg-[#E8DCCF] ${cardClass || ''}`}>
        <iframe
          src={src}
          title={title}
          loading="lazy"
          scrolling="no"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
      <figcaption className="px-2 pb-1 pt-3 text-center text-xs leading-relaxed text-[#4A2F24]/65">
        {caption}
      </figcaption>
    </figure>
  );
}
