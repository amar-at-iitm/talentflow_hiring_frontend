import React, { useEffect, useState } from 'react';
import { useAssessment, useSaveAssessment, useSubmitAssessment } from '../../hooks/useAssessments';
import { useForm } from 'react-hook-form';

function defaultQuestion(id:number) {
  return { id: `q${id}`, type: 'short', title: `Question ${id}`, required: false, meta: {}};
}

export default function AssessmentBuilder() {
  // For demo, pick the first job available from DB via API call or a job selector.
  const [jobId, setJobId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const assessment = useAssessment(jobId || '');
  const save = useSaveAssessment(jobId || '');
  const submit = useSubmitAssessment(jobId || '');

  useEffect(() => {
    // naive: pick 1st job via fetch
    (async () => {
      const res = await fetch('/api/jobs?page=1&pageSize=25');
      const json = await res.json();
      if (json.items?.length) {
        setJobId(json.items[0].id);
      }
    })();
  }, []);

  useEffect(() => {
    if (assessment.data?.builderState?.questions) {
      setQuestions(assessment.data.builderState.questions || []);
    } else {
      setQuestions(Array.from({length:5}).map((_,i)=> defaultQuestion(i+1)));
    }
  }, [assessment.data]);

  const addQuestion = () => {
    setQuestions(prev => [...prev, defaultQuestion(prev.length + 1)]);
  };

  const saveBuilder = async () => {
    if (!jobId) return;
    await save.mutateAsync({ builderState: { questions } });
    alert('Saved');
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded shadow">
        <div className="flex justify-between items-center mb-3">
          <div className="font-semibold">Builder</div>
          <div className="text-sm">Job: {jobId}</div>
        </div>

        <div className="space-y-3">
          {questions.map((q, idx) => (
            <div key={q.id} className="border p-3 rounded">
              <input className="w-full border p-2 rounded mb-2" value={q.title} onChange={e => {
                const v = e.target.value;
                setQuestions(prev => prev.map((p,i)=> i===idx ? {...p, title: v} : p));
              }}/>
              <select value={q.type} onChange={e => {
                const t = e.target.value;
                setQuestions(prev => prev.map((p,i)=> i===idx ? {...p, type: t} : p));
              }} className="border p-2 rounded">
                <option value="short">Short text</option>
                <option value="long">Long text</option>
                <option value="single">Single choice</option>
                <option value="multi">Multiple choice</option>
                <option value="numeric">Numeric</option>
                <option value="file">File</option>
              </select>
              <div className="mt-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={q.required} onChange={e=> setQuestions(prev => prev.map((p,i)=> i===idx ? {...p, required: e.target.checked} : p))}/>
                  Required
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <button onClick={addQuestion} className="px-3 py-2 border rounded">Add question</button>
          <button onClick={saveBuilder} className="px-3 py-2 bg-green-600 text-white rounded">Save builder</button>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <div className="font-semibold mb-3">Live Preview</div>
        <AssessmentPreview questions={questions} jobId={jobId} onSubmit={async (candidateId, response) => {
          if (!jobId) return;
          await submit.mutateAsync({ candidateId, response });
          alert('Submitted');
        }} />
      </div>
    </div>
  );
}

function AssessmentPreview({ questions, jobId, onSubmit }: { questions:any[]; jobId:string | null; onSubmit: (candidateId:string, response:any)=>Promise<void> }) {
  const { register, handleSubmit, watch } = useForm();
  const onSubmitForm = (data:any) => {
    const candidateId = 'demo-candidate';
    onSubmit(candidateId, data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-3">
      {questions.map((q:any) => (
        <div key={q.id}>
          <div className="font-medium">{q.title} {q.required && '*'}</div>
          {q.type === 'short' && <input {...register(q.id)} className="border p-2 rounded w-full" />}
          {q.type === 'long' && <textarea {...register(q.id)} className="border p-2 rounded w-full" />}
          {q.type === 'numeric' && <input type="number" {...register(q.id)} className="border p-2 rounded w-full" />}
          {q.type === 'file' && <input type="file" {...register(q.id)} />}
          {q.type === 'single' && <div><label><input type="radio" {...register(q.id)} value="yes" /> Yes</label><label><input type="radio" {...register(q.id)} value="no" /> No</label></div>}
          {q.type === 'multi' && <div><label><input type="checkbox" {...register(q.id)} value="opt1" /> Option 1</label></div>}
        </div>
      ))}

      <div className="flex justify-end">
        <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded">Submit</button>
      </div>
    </form>
  );
}
