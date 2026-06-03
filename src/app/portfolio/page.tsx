import SquashPushSummary from "./squashpush/SquashPushSummary";
import VSColorCodeSummary from "./squashpush/VSColorCodeSummary";
import ChartStudioSummary from "./squashpush/ChartStudioSummary";
import UploadSpecSummary from "./squashpush/UploadSpecSummary";

export default function Portfolio() {
  return (
    <div className="divide-y-2 divide-gray-300">
      <a href="./portfolio/squashpush">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-12 px-6 md:px-12 lg:px-24 ">
          <SquashPushSummary />
        </div>
      </a>
      <a className="block">
        <div className="bg-gradient-to-r to-indigo-600 from-purple-600 py-12 px-6 md:px-12 lg:px-24 ">
          <VSColorCodeSummary />
        </div>
      </a>
      <a href="./portfolio/chartstudio" className="block">
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 py-12 px-6 md:px-12 lg:px-24 ">
          <ChartStudioSummary />
        </div>
      </a>
      <a href="./portfolio/uploadspec" className="block">
        <div className="bg-gradient-to-r from-emerald-800 to-teal-600 py-12 px-6 md:px-12 lg:px-24 ">
          <UploadSpecSummary />
        </div>
      </a>
    </div>
  );
}
