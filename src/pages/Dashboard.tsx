import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useSessionStore } from '../store/session';
import { LineChart, Clock, MousePointer2, Keyboard } from 'lucide-react';
import { KeystrokePatternChart } from '../components/charts/KeystrokePatternChart';
import { MouseMovementChart } from '../components/charts/MouseMovementChart';

interface TaskStats {
  taskType: string;
  completionTime: number;
  keystrokeCount: number;
  mouseEvents: number;
  keystrokePatterns: Array<{
    timestamp: number;
    dwellTime: number;
    flightTime: number;
  }>;
  mouseMovements: Array<{
    timestamp: number;
    speed: number;
    acceleration: number;
  }>;
}

export function Dashboard() {
  const { sessionId } = useSessionStore();
  const [stats, setStats] = useState<TaskStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    if (!sessionId) {
      setError('No session ID found');
      setLoading(false);
      return;
    }

    try {
      const [completions, keystrokes, mouseData] = await Promise.all([
        supabase
          .from('task_completions')
          .select('*')
          .eq('session_id', sessionId),
        supabase
          .from('keystroke_data')
          .select('*')
          .eq('session_id', sessionId)
          .order('timestamp', { ascending: true }),
        supabase
          .from('mouse_data')
          .select('*')
          .eq('session_id', sessionId)
          .order('timestamp', { ascending: true })
      ]);

      if (completions.error) throw completions.error;
      if (keystrokes.error) throw keystrokes.error;
      if (mouseData.error) throw mouseData.error;

      const taskTypes = ['form', 'interactive', 'browsing'];
      const compiledStats = taskTypes.map(taskType => {
        const completion = completions.data?.find(c => c.task_type === taskType);
        const taskKeystrokes = keystrokes.data?.filter(k => k.task_type === taskType) || [];
        const taskMouseData = mouseData.data?.filter(m => m.task_type === taskType) || [];

        return {
          taskType,
          completionTime: completion?.duration || 0,
          keystrokeCount: taskKeystrokes.length,
          mouseEvents: taskMouseData.length,
          keystrokePatterns: taskKeystrokes.map(k => ({
            timestamp: new Date(k.timestamp).getTime(),
            dwellTime: k.dwell_time || 0,
            flightTime: k.flight_time || 0
          })),
          mouseMovements: taskMouseData.map(m => ({
            timestamp: new Date(m.timestamp).getTime(),
            speed: m.speed || 0,
            acceleration: m.acceleration || 0
          }))
        };
      });

      setStats(compiledStats);
      if (!selectedTask && compiledStats.length > 0) {
        setSelectedTask(compiledStats[0].taskType);
      }
      setError(null);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load statistics. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading statistics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const selectedTaskData = stats.find(s => s.taskType === selectedTask);

  if (!selectedTaskData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">No data available for analysis</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Task Performance Dashboard
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Your behavioral biometrics data analysis
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-center space-x-4">
            {stats.map((stat) => (
              <button
                key={stat.taskType}
                onClick={() => setSelectedTask(stat.taskType)}
                className={`px-4 py-2 rounded-md ${
                  selectedTask === stat.taskType
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {stat.taskType.charAt(0).toUpperCase() + stat.taskType.slice(1)} Task
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Keystroke Analysis</h3>
            <KeystrokePatternChart
              patterns={selectedTaskData.keystrokePatterns}
              taskType={selectedTaskData.taskType}
            />
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Keyboard className="h-5 w-5 text-gray-400" />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-500">Total Keystrokes</div>
                    <div className="mt-1 text-lg font-semibold text-gray-900">
                      {selectedTaskData.keystrokeCount}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-500">Avg. Dwell Time</div>
                    <div className="mt-1 text-lg font-semibold text-gray-900">
                      {Math.round(
                        selectedTaskData.keystrokePatterns.reduce((acc, curr) => acc + curr.dwellTime, 0) /
                          selectedTaskData.keystrokePatterns.length || 0
                      )}ms
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Mouse Movement Analysis</h3>
            <MouseMovementChart
              movements={selectedTaskData.mouseMovements}
              taskType={selectedTaskData.taskType}
            />
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <MousePointer2 className="h-5 w-5 text-gray-400" />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-500">Mouse Events</div>
                    <div className="mt-1 text-lg font-semibold text-gray-900">
                      {selectedTaskData.mouseEvents}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <LineChart className="h-5 w-5 text-gray-400" />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-500">Avg. Speed</div>
                    <div className="mt-1 text-lg font-semibold text-gray-900">
                      {Math.round(
                        selectedTaskData.mouseMovements.reduce((acc, curr) => acc + curr.speed, 0) /
                          selectedTaskData.mouseMovements.length || 0
                      )} px/ms
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}