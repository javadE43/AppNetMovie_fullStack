const Unauthorized = () => {
  return (
    <div className="flex flex-wrap justify-center	items-center">
      <div className="w-[21rem] max-w-[100%] bg-black rounded-xl p-3 text-white m-5 flex flex-col  cursor-pointer text-xl hover:scale-110 h-36 justify-center item-center">
        <div className="h-[100%]">
          <h4> شما دسترسی لازم را ندارید </h4>
        </div>
      </div>{" "}
    </div>
  );
};

export default Unauthorized;
