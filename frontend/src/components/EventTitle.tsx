export const EventTitle = ({ title }: any) => {
  return (
    <div className="flex flex-row gap-x-4 items-center select-none">
      <img
        src="https://probo.in/_next/image?url=https%3A%2F%2Fprobo.gumlet.io%2Fimage%2Fupload%2Fprobo_product_images%2FIMAGE_207fe0ff-6e8a-474a-a762-08ebbf2e36b8.png&w=96&q=75"
        alt="Event Image"
        loading="lazy"
        className="md:w-18 md:h-18 w-12 h-12"
      />
      <h1 className="text-zinc-800 font-semibold text-2xl text-wrap break-words md:w-[60%] w-[60%]">
        {title}
      </h1>
    </div>
  );
};
