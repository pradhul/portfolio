import SquashPushSummary from "./squashpush/SquashPushSummary";
import VSColorCodeSummary from "./squashpush/VSColorCodeSummary";

export default function Portfolio() {
  return (
    <div className="divide-x-2 divide-gray-300">
      <a href="./portfolio/squashpush">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-12 px-6 md:px-12 lg:px-24 ">
          <SquashPushSummary />
        </div>
      </a>
      <a>
        <div className="bg-gradient-to-r to-indigo-600 from-purple-600 py-12 px-6 md:px-12 lg:px-24 ">
          <VSColorCodeSummary />
        </div>
      </a>
    </div>
  );
}
