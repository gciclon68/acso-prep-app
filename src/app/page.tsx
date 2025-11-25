import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpen, BrainCircuit, GraduationCap } from 'lucide-react';

const classes = [
  { id: 'Clase 16', title: 'Clase 16: Intro SO' },
  { id: 'Clase 17', title: 'Clase 17: Procesos' },
  { id: 'Clase 18', title: 'Clase 18: Threads' },
  { id: 'Clase 19', title: 'Clase 19: Scheduling' },
  { id: 'Clase 20', title: 'Clase 20: Sincronización' },
  { id: 'Clase 21', title: 'Clase 21: Deadlocks' },
  { id: 'Clase 22', title: 'Clase 22: Memoria' },
  { id: 'Clase 23', title: 'Clase 23: Paginación' },
  { id: 'Clase 24', title: 'Clase 24: Memoria Virtual' },
  { id: 'Clase 25', title: 'Clase 25: File Systems' },
  { id: 'Clase 26', title: 'Clase 26: I/O' },
  { id: 'Clase 27', title: 'Clase 27: VM Farms' },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">ACSO Final Prep</h1>
          <p className="text-xl text-slate-600">Master your Operating Systems final with AI-powered study tools.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {classes.map((c) => (
              <Link key={c.id} href={`/class/${c.id}`}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-slate-200 hover:border-indigo-300 group">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 group-hover:text-indigo-600 transition-colors">
                      <BookOpen className="h-5 w-5" />
                      {c.title}
                    </CardTitle>
                    <CardDescription>View summary, mind map & quiz</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>

          <div className="space-y-6">
            <Card className="bg-indigo-600 text-white border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-6 w-6" />
                  Exam Simulator
                </CardTitle>
                <CardDescription className="text-indigo-100">
                  Ready for the real thing? Take a simulated final exam with mixed questions.
                </CardDescription>
                <Link href="/exam" className="mt-4 block">
                  <button className="w-full bg-white text-indigo-600 font-bold py-2 px-4 rounded hover:bg-indigo-50 transition-colors">
                    Start Exam
                  </button>
                </Link>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BrainCircuit className="h-5 w-5" />
                  Progress
                </CardTitle>
                <CardDescription>Track your study progress across all classes.</CardDescription>
                {/* Progress bar placeholder */}
                <div className="w-full bg-slate-200 rounded-full h-2.5 mt-2">
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '10%' }}></div>
                </div>
                <p className="text-xs text-slate-500 mt-1">1/12 Classes Completed</p>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
