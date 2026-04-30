export default function InterviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="interview-room -mx-4 -my-10 min-h-[calc(100vh-57px)] px-4 py-10 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      {children}
    </div>
  );
}
