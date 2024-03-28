import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState, useEffect } from 'react'
import axios from 'axios';
import secureLocalStorage from "react-secure-storage";
import * as Spinners from 'react-spinners';
import Cookies from 'js-cookie';


export default function PoshmarkLinkPopup(props) {
  const [accountLinked, setAccountLinked] = useState(false)
  const [isWaitingForFetch, setIsWaitingForFetch] = useState(true)


  let cookieLoopEn = true;

  function disableModal() {
    console.log("disabling")
    cookieLoopEn = false;
    console.log(cookieLoopEn)
    if (setAccountLinked) {
      //window.location.reload();
    }

    stopListening()
    props.closeModal()
  }

  const stopListening = () => {

    Cookies.remove('cz_al')
    Cookies.remove('cz_jinfo')
    Cookies.remove('cz_uinfo')
    console.log("stopped listening to cookie")

  };



  useEffect(() => {
    //console.log(accountLinked)
  }, [accountLinked]);


  async function getCookies() {
    let i = 0

    const expires = new Date();
    expires.setHours(expires.getHours() + 1);

    let getCookieLoop = setInterval(async () => {

      if (Cookies.get('cz_al') == process.env.REACT_APP_USER) {
        Cookies.set('cz_al', process.env.REACT_APP_USER, { expires: 1 / 24 })

        if (Cookies.get('cz_jinfo') && Cookies.get('cz_uinfo')) {
          let jwt = Cookies.get('cz_jinfo')
          let ui = Cookies.get('cz_uinfo')

          Cookies.set('cz_al', '')
          clearInterval(getCookieLoop)

          var options = {
            method: 'POST',
            url: `${process.env.REACT_APP_DOMAIN}/api/cookieGetter`,
            headers: { 'content-type': 'application/json' },
            data: { authuser: process.env.REACT_APP_USER, jwt: jwt, ui: ui }
          };



          axios.request(options).then(function (res) {


            console.log('eee')

            if ('error' in res.data) {
              console.log('aa' + JSON.stringify(res))

            }
            else {


              secureLocalStorage.setItem("udt", res.data.accountUser)
              secureLocalStorage.setItem("cookieStatus", "true")
              setAccountLinked(true)

              console.log('it has been linked ' + JSON.stringify(res))
              Cookies.remove('cz_al')
              Cookies.remove('cz_jinfo')
              Cookies.remove('cz_uinfo')

            }


          }).catch(function (error) {
            console.error(error);

          });
        }


      }



      else {
        Cookies.set('cz_al', process.env.REACT_APP_USER, { expires: 1 / 24 })
      }







    }, 3000);
  }



  useEffect(() => {
    getCookies()


  }, [])

  function Backdrop() {
    return (
      <div
        className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 z-9"
        style={{ pointerEvents: 'none' }}
      ></div>
    );
  }

  return (

    <>
      {props.isOpen && <Backdrop />}


      <Transition appear show={props.isOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={() => null}  >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto z-40" >
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all ">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Connect to Poshmark
                  </Dialog.Title>


                  {!accountLinked ? (
                    <div>
                      <div>
                        <p className="flex items-center justify-center">{"Waiting for chrome extension..."}</p>
                        <div className="flex items-center justify-center">
                          <Spinners.PropagateLoader color="#32415D" loading={true} />
                        </div>
                      </div>
                      <div className="mt-4">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-red-200 px-4 py-2 text-sm font-medium text-black-900 hover:bg-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                          onClick={disableModal}
                        > Cancel </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div>
                        <p className="flex items-center justify-center">{"Successfully linked account: " + secureLocalStorage.getItem("udt")}</p>
                      </div>

                      <div className="mt-4">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-red-200 px-4 py-2 text-sm font-medium text-black-900 hover:bg-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                          onClick={disableModal}
                        > Close </button>
                      </div>
                    </div>
                  )
                  }
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

    </>
  )


}


