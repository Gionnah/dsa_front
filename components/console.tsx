import { ArrowBigDownDash, CloudCheck, File, Play } from 'lucide-react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CODE_SNIPPETS } from '@/lib/constant';
import AnimatedList from './AnimatedList';
import { useState, useEffect } from 'react';

export default function Console({error, code, id, output, loading, loadingSubmit, submitCode, runCode, setLanguage, setValue, runSingleTest, runAllTest, challengeData, resTest, activeMode, onSave, loadingSave, }: {
    error: string, 
    submitCode: (code: string, id: string) => void,
    output: string, 
    id: string
    loading: boolean, 
    loadingSubmit: boolean,
    code: string,
    runCode: () => void,
    setLanguage: (lang: string) => void, 
    setValue: (code: string) => void, 
    challengeData: any, 
    runSingleTest: (id: number) => void, 
    runAllTest: () => void, 
    resTest: any,
    activeMode: 'code' | 'test',
    onSave: () => void,
    loadingSave: boolean,
}) {
    const [popup, setPopup] = useState<{message: string; type: 'success' | 'error' | 'info'} | null>(null);
    const [selectedTestIndex, setSelectedTestIndex] = useState<number>(-1);
    const [showPopupSubmit, setShowPopupSubmit] = useState<boolean>(false);

    // Gestionnaire de popup éphémère
    useEffect(() => {
        if (popup) {
            const timer = setTimeout(() => {
                setPopup(null);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [popup]);

    const showPopup = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setPopup({ message, type });
    };

    // Styles pour les différents types de popup
    const getPopupStyles = (type: string) => {
        switch (type) {
            case 'success':
                return 'bg-green-500 border-green-600';
            case 'error':
                return 'bg-red-500 border-red-600';
            case 'info':
                return 'bg-blue-500 border-blue-600';
            default:
                return 'bg-blue-500 border-blue-600';
        }
    };

    const handleRunCode = () => {
        if (loading) return;
        showPopup('Exécution du code en cours...', 'info');
        runCode();
    };

    const handleRunSingleTest = (id: number) => {
        showPopup(`Lancement du test ${id}...`, 'info');
        runSingleTest(id);
    };

    // Nouveau gestionnaire pour la sélection dans la liste
    const handleTestSelect = (item: number, index: number) => {
        setSelectedTestIndex(index);
        handleRunSingleTest(item);
    };

    const handleSave = () => {
        onSave();
    };

    const handleLanguageChange = (value: string) => {
        setLanguage(value);
        setValue(CODE_SNIPPETS[value]);
        showPopup(`Langage changé en ${value}`, 'info');
    };

    const handleSubjectClick = () => {
        showPopup('Ouverture du sujet...', 'info');
    };

    const handleInputClick = () => {
        showPopup('Téléchargement des inputs...', 'info');
    };

    const handleFinishClick = () => {
        showPopup('Finalisation en cours...', 'info');
        submitCode(code, id);
    };

    const handleRunAllTest = () => {
        showPopup('Execution en cours...', 'info');
        runAllTest();
    };


    const renderTestResults = () => {
        if (!resTest) return null;

        const { data } = resTest;
        
        if (!data) {
            return (
                <>
                    <p className='my-1 text-red-500'>Erreur</p>
                    <div className='text-red-600 text-xs whitespace-pre'>{resTest.message || "Une erreur est survenue"}</div>
                </>
            );
        }

        const { success, passed_tests, total_tests, results, message } = data;

        if (success) {
            return (
                <>
                    <p className='my-1 text-green-500'>✅ Tous les tests sont passés!</p>
                    <div className='text-green-400 text-xs'>
                        Tests réussis: {passed_tests}/{total_tests}
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <p className='my-1 text-red-500'>❌ Échec sur certains tests</p>
                    <div className='text-red-400 text-xs mb-2'>
                        Tests réussis: {passed_tests}/{total_tests}
                    </div>
                    
                    {results && results.map((result: any, index: number) => (
                        <div key={index} className="mb-3 p-2 bg-red-950/20 rounded border border-red-800/30">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-red-400 text-xs font-semibold">
                                    Test {result.test_number}
                                </span>
                                <span className={`text-xs px-2 py-1 rounded ${result.passed ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                                    {result.passed ? 'PASSED' : 'FAILED'}
                                </span>
                            </div>
                            
                            {!result.passed && (
                                <div className="space-y-2 text-xs">
                                    <div>
                                        <span className="text-gray-400">Expected:</span>
                                        <div className="text-green-400 font-mono bg-black/30 p-1 rounded mt-1 whitespace-pre-wrap">
                                            {result.expected_output}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Your output:</span>
                                        <div className="text-red-400 font-mono bg-black/30 p-1 rounded mt-1 whitespace-pre-wrap">
                                            {result.user_output}
                                        </div>
                                    </div>
                                    {result.error && (
                                        <div>
                                            <span className="text-gray-400">Error:</span>
                                            <div className="text-orange-400 font-mono bg-black/30 p-1 rounded mt-1 whitespace-pre-wrap">
                                                {result.error}
                                            </div>
                                        </div>
                                    )}
                                    {result.execution_time && (
                                        <div className="text-gray-500 text-xs">
                                            Execution time: {result.execution_time}s
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                    
                    {message && (
                        <div className='text-orange-400 text-xs mt-2 p-2 bg-orange-950/20 rounded border border-orange-800/30'>
                            {message}
                        </div>
                    )}
                </>
            );
        }
    };

    const renderOutput = () => {
        if (activeMode === 'test' && resTest) {
            return renderTestResults();
        } else {
            return (
                <>
                    <p className='my-1 text-gray-200'>{!output && !error ? "Output:" : ""}</p>
                    {output && output !== "No output" && (
                        <>
                            <p className='my-1 text-green-500'>Ok :D</p>
                            <div className='text-gray-300 text-xs whitespace-pre'>{output}</div>
                        </>
                    )}
                    {error && (
                        <>
                            <p className='my-1 text-red-500'>Error: </p>
                            <div className='text-red-600 text-xs whitespace-pre'>{error}</div>
                        </>
                    )}
                </>
            );
        }
    };

    return (
    <div className='w-full px-4 relative &::-webkit-scrollbar-track]:bg-[#060010] [&::-webkit-scrollbar-thumb]:bg-[#222]'>
        {/* Popup éphémère */}
        {popup && (
            <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg border ${getPopupStyles(popup.type)} text-white transition-all duration-300 transform translate-x-0 animate-fade-in`}>
                <div className="flex items-center">
                    <span>{popup.message}</span>
                </div>
            </div>
        )}
        
        {showPopupSubmit && <div className='fixed top-0 left-0 h-screen w-full bg-black/60 z-40'>
            <div className="w-full h-full flex items-center justify-center">
                <div className="bg-white popup text-neutral-800 text-sm max-w-lg rounded-xl shadow-black shadow-2xl p-4">
                    <h1 className='text-amber-500 text-lg text-center font-semibold'>Warning !</h1>
                    <p className='text-center'>This action will end the challenge and award you points according to the validated tests, you can retry it later</p> 
                    <p><span className='font-bold text-black text-lg'>Note:</span> You will only be awarded points if you pass a certain number of tests.</p>
                    <div className="flex w-full items-center gap-2 mt-3">
                        <button onClick={() => setShowPopupSubmit(!showPopupSubmit)} className='w-full cursor-pointer hover:shadow transition-all duration-300 ease-in-out text-white px-4 py-2 bg-amber-500 hover:bg-amber-600 rounded-lg border border-gray-200'> cancel </button>    
                        <button onClick={handleFinishClick} className='w-full cursor-pointer hover:shadow transition-all duration-300 ease-in-out text-white px-4 py-2 bg-teal-500  hover:bg-teal-600 rounded-lg border border-gray-200'> Submit</button>    
                    </div>                
                </div>
            </div>
        </div>}

        <div className="p-2 rounded-t-lg bg-blue-900/15 &::-webkit-scrollbar-track]:bg-[#060010] [&::-webkit-scrollbar-thumb]:bg-[#222]">
            <div className="option flex items-end justify-between">
                <div className="select text-white pb-2">
                    <p className="text-gray-600 py-2">Language: </p>
                    <Select onValueChange={handleLanguageChange}>
                        <SelectTrigger className="w-[120px] text-white bg-gray-800">
                            <SelectValue placeholder="python 3" />
                        </SelectTrigger>
                        <SelectContent className="text-white">
                            <SelectGroup className="bg-gray-800">
                                {/* <SelectItem className="hover:bg-gray-800 hover:text-cyan-600" value="javascript">Javascript</SelectItem> */}
                                <SelectItem className="hover:bg-gray-800 hover:text-cyan-600" value="python">python 3</SelectItem>
                                {/* <SelectItem className="hover:bg-gray-800 hover:text-cyan-600" value="java">Java</SelectItem>
                                <SelectItem className="hover:bg-gray-800 hover:text-cyan-600" value="php">Php</SelectItem>
                                <SelectItem className="hover:bg-gray-800 hover:text-cyan-600" value="c">C</SelectItem>
                                <SelectItem className="hover:bg-gray-800 hover:text-cyan-600" value="r">R</SelectItem> */}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="header grid lg:grid-cols-3 gap-3 items-center text-sm">
                <button 
                    onClick={handleRunCode} 
                    disabled={loading}
                    className='flex items-center justify-center gap-2 rounded-lg px-3 py-2 cursor-pointer border text-teal-500 hover:bg-teal-600/10 transition-all duration-200 hover:shadow-lg hover:scale-105 border-teal-500 border-dashed disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {loading ? "Running..." : <>Run <Play className='w-4 h-4'/></>}
                </button>
                <button 
                    onClick={handleSubjectClick}
                    className='flex items-center gap-2 rounded-lg px-3 py-2 disabled cursor-not-allowed hover:bg-gray-600/15 transition-all duration-200 text-gray-300 hover:shadow-lg'
                >
                    Instructions <File className='w-6 h-6'/>
                </button>
                <button 
                    onClick={handleInputClick}
                    className='flex items-center disabled cursor-not-allowed gap-2 rounded-lg px-3 py-2 hover:bg-gray-600/15 transition-all duration-200 text-gray-300 hover:shadow-lg'
                >
                    Input(s) <ArrowBigDownDash className='w-4 h-4'/>
                </button>
            </div>
        </div>
        
        {/* Output Section */}
        <div className={`h-[30vh] w-full shadow-inner border ${
            activeMode === 'test' && resTest ? 
                (resTest.data?.success ? "border-green-900 bg-neutral-800 shadow-black" : "border-red-950 bg-neutral-800 shadow-red-950") :
            output && output !== "No output" ? "border-green-900 bg-neutral-800 shadow-black" : 
            error ? "border-red-950 bg-neutral-800 shadow-red-950" : 
            "border-gray-900 shadow-black bg-neutral-800"
        } mt-2 rounded-b-lg p-4 text-sm font-mono overflow-y-auto &::-webkit-scrollbar-track]:bg-[#060010] [&::-webkit-scrollbar-thumb]:bg-[#222]`}>
            
            {renderOutput()}
        </div>

        {/* Test Cases List */}
        <div className="h-[30vh] border border-neutral-800 w-full mt-2 rounded-sm text-sm text-green-400 font-mono overflow-hidden">
            <AnimatedList
                items={challengeData?.test_cases?.map((test: any) => test?.id) || []}
                onItemSelect={handleTestSelect}
                selectedIndex={selectedTestIndex}
                onSelectedIndexChange={setSelectedTestIndex}
                showGradients={true}
                enableArrowNavigation={true}
                displayScrollbar={true}
                data={resTest?.data}
            />
        </div>
        
        <div className="mt-2 flex gap-2">
            <button 
                onClick={handleRunAllTest}
                className='mt-2 cursor-pointer bg-teal-600 hover:bg-teal-700 transition-all ease-in-out duration-200 rounded-lg w-full py-2 px-4 text-center'
            >
                Run all Test
            </button>
            <button 
                onClick={() => setShowPopupSubmit(!showPopupSubmit)}
                className={`mt-2 transition-all duration-300 ease-in-out ${loadingSubmit ? 'bg-amber-800 disabled cursor-not-allowed' : 'bg-amber-600 cursor-pointer hover:bg-amber-700'} transition-all ease-in-out duration-200 rounded-lg w-full py-2 px-4 text-center`}
            >
                {loadingSubmit ? <>Loading submit...</>: <>Set as finished</>}
            </button>
        </div>
    </div>
  )
}