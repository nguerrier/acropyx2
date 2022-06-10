import Pilot from "../Pilot";
import React, {useState} from "react";
import PopupModal from "../Modal/PopupModal";
import FormInput from "../FormInput/FormInput";

const PilotTable = ({pilots}) => {

  const [pilotInfoModal, setPilotInfoModal] = useState(false)

    return (
      <>
        <div className="sections-list">
          {pilots.length && (
              pilots.map((pilot) => (
                <Pilot showPilotInfoModal={() => setPilotInfoModal(pilot)} key={pilot.id} pilot={pilot}  />
              ))
          )}
          {!pilots.length && (
              <p>No pilots found!</p>
          )}
        </div>
        {pilotInfoModal && <PopupModal
						modalTitle={"Pilot Info"}
						onCloseBtnPress={() => {
							setPilotInfoModal(false);
						}}
					>
						<div className="mt-4 text-left">
							<form className="mt-5">
								<FormInput
									disabled
									type={"text"}
									name={"label"}
									label={"Label"}
									value={pilotInfoModal?.label}
								/>
								<FormInput
									disabled
									type={"text"}
									name={"url"}
									label={"Url"}
									value={pilotInfoModal?.url}
								/>
								<FormInput
									disabled
									type={"text"}
									name={"source"}
									label={"Source"}
									value={pilotInfoModal?.source}
								/>
							</form>
						</div>
					</PopupModal>}
      </>
    )
}

export default PilotTable;
