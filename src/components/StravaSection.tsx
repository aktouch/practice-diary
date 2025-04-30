export default function StravaSection({ distance, time, pace }: { distance: string, time: string, pace: string }) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg mb-4 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-600">Strava データ</h2>
        <p className="mt-2 text-sm">距離: {distance}</p>
        <p className="text-sm">時間: {time}</p>
        <p className="text-sm">ペース: {pace}</p>
      </div>
    );
  }
  