import React from 'react'

interface ConfirmLeaveModalProps {
    onClose: () => void
    onConfirm: () => void
}

export const ConfirmLeaveModal: React.FC<ConfirmLeaveModalProps> = ({ onClose, onConfirm }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
                <h3 className="text-lg font-semibold mb-3">작성 중인 내용이 있습니다</h3>
                <p className="text-gray-600 mb-5">저장하지 않은 변경사항이 있습니다. 정말로 페이지를 떠나시겠습니까?</p>
                <div className="flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded">
                        취소
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded">
                        나가기
                    </button>
                </div>
            </div>
        </div>
    )
}
