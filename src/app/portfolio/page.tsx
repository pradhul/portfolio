import SquashPushSummary from "./squashpush/hero";

export default function Portfolio() {
  return (
    <div>
      <a href="./portfolio/squashpush">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-12 px-6 md:px-12 lg:px-24">
          <SquashPushSummary />
        </div>
      </a>
    </div>
  );
}
