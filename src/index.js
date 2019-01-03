const fs = require('fs');
const child = require('child_process').execFile;

const DIABLO_PATH = 'd:\\games\\Diablo II';
const TARGET_FILE = '\\Patch_D2.mpq';
const SWAP_ORIGINAL = '\\backup113d';
const SWAP_POD = '\\Path of Diablo';
const UDIETOO_PATH = 'd:\\games\\Diablo II\\Apps\\UdieToo\\UdieToo.exe';
const ORI_SAVE_PATH = '\\Save';
const POD_SAVE_PATH = '\\Save\\Mod PlugY';
const ZOD_CHARACTER_FILES = [
  'Zod.d2s',
  'Zod.d2x',
  'Zod.key'
];

document.addEventListener('DOMContentLoaded', () => {
  const elemBtnOri = document.querySelector('.btn-to-original');
  const elemBtnPod = document.querySelector('.btn-to-pod');
  const elemChkUdie = document.querySelector('#chk_openUdietoo');
  const elemChkZod = document.querySelector('#chk_copyZod');
  const elemPrint = document.getElementById('print');

  function print(msg, isError = false) {
    const tag = isError ? `<span style="color: red">${msg}</span>` : msg;
    elemPrint.innerHTML = elemPrint.innerHTML + tag + '<br/>';
    setTimeout(() => {
      elemPrint.scrollTo(0, elemPrint.scrollTop + 100);
    }, 100);
  }

  const fnUdietooCall = () => {
    if (elemChkUdie.checked) {
      child(UDIETOO_PATH, (err, data) => {
        if (err) {
          print('udietoo execution fail!', true);
          console.log(err);
        } else {
          print('udietoo executing...');
        }
      });
    }
  };

  function copyZodToPod() {
    if (elemChkZod.checked) {
      const aPrm = ZOD_CHARACTER_FILES.map(fileName => {
        return copyFile(
          DIABLO_PATH + ORI_SAVE_PATH + '\\' + fileName,
          DIABLO_PATH + POD_SAVE_PATH + '\\' + fileName,
        );
      });
      
      return Promise.all(aPrm);
    }

    return Promise.resolve(tru);
  }

  function copyFile(src, dest) {
    return new Promise((resolve, reject) => {
      fs.readFile(src, (err, data) => {
        if (err) {
          reject(err);
        }
        fs.writeFile(dest, data, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve(true);
          }
        });
      });
    });
  }

  elemBtnOri.addEventListener('click', event => {
    print('to original ...');
    copyFile(
      DIABLO_PATH + SWAP_ORIGINAL + TARGET_FILE,
      DIABLO_PATH + TARGET_FILE,
    ).then(() => {
      print('file copy success.');
      fnUdietooCall();
    }).catch(() => {
      print('file write fail.', true);
    });
  });
  elemBtnPod.addEventListener('click', event => {
    print('to pod ...');
    copyFile(
      DIABLO_PATH + SWAP_POD + TARGET_FILE,
      DIABLO_PATH + TARGET_FILE,
    ).then(() => {
      print('file copy success.');
    }).then(() => {
      copyZodToPod()
      .then(() => {
        print('zod file copy success.');
      })
      .catch((err) => {
        print('zod file copy fail', true);
        console.log(err);
      });
    })
    .catch(() => {
      print('file write fail.', true);
    });
  });

  print('program ready.');
});
