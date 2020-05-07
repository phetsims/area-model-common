/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
const mipmaps = [
  {
    "width": 150,
    "height": 196,
    "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAADECAYAAAB9R9geAAAAAklEQVR4AewaftIAACs1SURBVO3BD3TTBYLo++/v10D/JvygpMaamqCR0lbtTyzzwpWBH919UI/v2TpWZN9FDDgeZB7v0i77fOwcfGlG1svMO0zLHu56OCMSwd0ZpWiZXa6F66WB6aydoTLpjhQrZUwkdmojENJ/FNv+Xjpj3coWmv5P23w+REVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFTV8CM4cZMHNrbiBA1JgQmH5kQAayARmQASk+VkNaio7BdFz/Cp+/la+5AQ9QB7gANxAgalgEpj4JKADyASVZFy8ZU7QY9VoWps1jni6OZF084brgu8rla534/K18cukKPn8rIS7gKFABeIgaksDUVQA8CxRkW1K4zziXbEsKybp4xlJnVzefXLpC3cUW6hpb6OzqdgN7gAogQNSgBKaeAqA0WRdvXrn4brItKSTr4pkoNeeaqKlv4pNLVwLAHqAMCBD1LQJTS1F8rKb0KWUR1qxUJpPP38rJs15qzjUFgD1AGRAg6k9imFryVn9ngZK72MRk0yXGkm1JwZqVGve5v025HOx8AegCaogihqlFSUvRKZnm+USKhNhZWLNSWZg2L+7Cpat5nV3dCnAKCDCDxTC12IPtN8y5i01EmmRdPLmLTYSYL/iu2oAuoIYZKoapo8So19oWpM4h25JCpFqYNo+FafPiLly6mtfZ1S0Dx4HrzDAxTA0FwKtbnnyY7z6YRp/LwU4SYmcRiZJ18SzNugtP87VFl4OdecBxIMAMEkPkkoD3AGeyLn7tY0vvJduSQr9yVwPZlhQi1SyNiDUrlc6ubsOnf7xmA44DzcwQMUSu/7owbd7aHz6zlFXfWcCCOyUGqvrdZxhTtOgSY4lkmeb5JOvi4+outqwFjgPNzAAxRCY5Plbj3PK9xegSYxlMTX0TzVfaybakEOmMKVqSdfFxdRdbXgC8gJtpTiQyleYuNpGsi6dPZ1c3l4Od3KyusYWpwpqVyvrV9xNyAJCZ5kQijxIfq1FyF5vod+yDixz74CI36+zqpq6xhanCmpXK+tX3E1IFyExjIpHH/pSyiPhYDf3qGlvIXWziZquW5VBT38RUYs1KZf3q+yWgCpCZpkQii5Ksi1esWan08/lb6WPUa7nZ6mUPU9fYQmdXN1OJNSuV3MUmCTgASExDIpHFvnLx3Qz0yaUr3Jc2l8EYDXpWLcuhrrGFqaZQSSfbkiIDB5iGRCKHHB+rUZZm3cVAPn8rRr2WW1m97GHqLrYwFa1ffT9GvbYAKGGa0RA5ti7Nuov4WA0D+VpaWZp1F7eyalkO23bto7Orm/hYDcPl87fS2dXNJ5eu0OdysJMrwesMdPlaJ5eDnfQx6rUkxM1iIKNeS3yshj4L0+bR5z7jXIYSH6thfd79lL59xt7Z1e0CXEwTGiKDBNhWLr6bm/n8rdxnnMut6JISWLUsh7rGFqxZqdzOBd9VPrl0BZ+/FV9LK5eDnRgNeoyG+WRa7mNOUiK6pAQyLSYG0iUlkGkx0afGfZ6bbdu1j+QkgWRdPMc+uEjH9a/w+VuJj9WQlqLDqNdi1Gsxpmgx6rUMZNRreUpZxMHjH70LLAACTAMaIkPBwrR5JOviGcjnbyVZF89g4mM1+Jr9QAarlz3MwfJ3sWalMpDP30pdYwt1jS34/K1kWkxY5QxyV5gwGvRY5QzC4Wv2U+Z8hz6Fed/FaNAz0KplD+P5w3kKlXT6XfBdpfTtM55PLl0p/uTSFRnIBuT4WI05LUXHfca5LEybx33GuVizUqm72CLVNbYcAJ5gGtAQGbZaM1O5WWdXN8lz4hmMUa/F1/wlfVYty2Hbrn10dnXzyaUr1F1soa6xheS5c1m17GHsjz2OVc5El5TASDxd9HdY5Qz6PLK2iF//ogyjQU+/1cty+MGJUxQq6fS7zziXEDPgAir4WmdXt/mTS1eUTy5dWXHsg4tKfKzGvDBtHvcZ51LX2FIAFAAVTHEaJp8ZkLMtKdzsk0tXMOq1DEWXlIBVzmDHa6dJnjuXVcsexl68nEyLibHw61+U0c++5Rl0SQkMZJUz+KpXwOdvxajX0s+o1+LztypABf/OAzgBJyGdXd3musaWgrrGlhVAAXAAcAEBprAYJp8t25KSZ81K5WYXfFeZpRFZmDaPm10JXufTL9p5PHcpfdIMegr+12U8lbecMuc7vPpP/0yZ8x3mJCXyUKaFsRI7exaDufjZH7ng8ZFpnk+/L6528OkfrzUDx7m1AFADvAXsAa4BEvAxU5iGybci+94UBuPzt5J9bwo36+zq5uRZL6tWPEI/q5xBn0fWFvFcYR4bC/PoE2zrYCwE2zqob/SSaTGhS0rgZs8V5vG9//P/5bGl9xIfq6HPfca5nDzrVQhfAChjGhCZfAX3pc1lMJ1d3STPiWegzq5uSt8+g/Xhh7BveYaBgm0d+Jr9bCzMo4+v2Y8uKYGxsG3XPtYW/x1PF+1kMJkWE9kZ93HyrJd+2ZYUQmTAzAwjMrkUo15Lsi6ecHR2dVP69hmsDz/E7u2buFmwrZ3d2zfR5+minTyytohtu/YxFoJt7cTEiJy/+BnllacZjH3LM5w868Xnb6VftiWFkAJmGJHJpSxMm8etdFz/ioEOuz5GN2ceu7dvYjBGg57CvOX0qXGfR6PRcOT4ryivPM1o6ZISUVUQRZHDlacZTKbFxAt/lc++o24u+K7SJ/veFEJWMMOITK5so17Lrfj8rdxnnEufclcDwa5ZvFW2g3DokhIAFVEU2V9eyWitXvYwvb29DKXI9j22rC9k/38/R825JrItKYQUAGZmEJHJJRtTtAyl5lwTtZ/4+dnOYnRJCYRj1bIcVFVFFAXqG72MVmHecp5c/V16enrQJSVyOxsL83irbAcVv/4DdY0tWLNSCSlgBhGZXGajXsvt+PytHDz+EW+V7cBo0BOup/KW09PTi6qqDMcja4uob/TydNFOfM1+Btq9fRNvle1g9/ZNDCXTYuKtsh0cPP4RRr2WkK3MIDFMHsWo19q+m53GrRz74CK1Dc38+P9+nhXfyWY4jAY9aQY9lafPYJUzeCpvOeHwNfv5m137CLZ1EDd7NlY5g4GMBj2xs2cRDv08CQGBDz9qoLu7V+rs6q4DPmYG0DCJEuJmMZTOrm4K85YzEoV5yynMW85w2Lc8g33LM9Q3enl+RylFtu8xGhsL8yh1HuGxpfdy7IOLW4EKZgCRyaMY9VpuZ2HaPJJ18dS4zzPRMi0mfM1+RkuXlMCqZTnEx2qIj9UogMIMIDKJ4mM13M7Kh+4m25LC8epaprIsi4nOrm5yF5sIsTMDiESwbEsK1qxUTlR/yETzNftZtSyHsZBpuZsLvqvkLjaRrItXAIVpTiTCGfVaOjvaOFFdy0QyGvT8bGcxY0GXlEjH9a+Ij9Xw2NJ7CTnANCcyBaxcfDf7yyuZqqxyBj5/K32sWaksTJtnBkqYxkSmgKVZd1F3/gL1jV6mg0IlnRA7IDNNiUwB8bEachebKHW+w1TW2dVNH6NeS6GSTsgBQGIaimHySIIgrLVmpRKOtBQdzn/5DTkPLMJo0DMZgm0dFPzATsq8Odx7dyrDUeM+z5x4SNbF02fBnRI+f6vhiyvtBuAo00wMk8cQH6uxfTc7jXDM0oh09/RS4XKz7vG/YKQeWVuEANx7dyqxs2dxK75mP/WNn+Fr/pIa93kOV57mb3btwypn8oP/43GGq7zyNGnJs0nWxdMvyzyfes+XcrDjhgC4mEY0TB6Xz9/KcDy29F5eeu1XvF5eycbCPEZi9/ZNlDqP4Nh7iEyLCV1SAv18zV/ia/bTR5eUQKbFRB9dUiJZFhNvle0g02JiJGrc53nqkVwGio/VsD7vfkrfPmPv7Or2AE6mCQ2Ty3PBd9V8n3Eu4Vqfdz+lziNY5QwyLSaGyypn8FbZDoJtHdQ3ermZVc5gvMTHariZUa+leM0SSt8+c6Czq5sQJ9NADJNLNuq18oI7JcKVrIun68ZXvHXiDI/nLiV29ixGInb2LIwGPUaDHqNBj9Ggx2jQMx6CbR28+k//zGNL72UwusRYshbMp7ahuaC7p/caUMMUJzK5Tl3wXWW4Hlt6L8FrV3DsPcRUUN/oxajXcjtGvZbiNUtI1sWXAgcAiSkshskVCLZ3Fa3+zgKGK2fRnRw69htmzZrNQ5kWItmJ6g/5zOclJ93A7egSY1madRee5mvy5WBnHtAAeJiCYphcge6e3gKjXmswzEtkOGZpRBamzWP3oeMY9MlkWkxEqjd/+T9JTuhhwZ0SQ5mlEbFmpRIfqzF8+sdrtu6eXjNQBwSYQmKYfItmaURrtiWF4dIlxpK1YD6v7P8XDPpkMi0mItHf7NrHo//LAnSJsYRrwZ0SOYsMXAlel7+40l4EvAEEmCJEJt+eusYWRsqo11K8Zgk7SvfzenklkabGfZ5ZoopRr2W4knXxXL7WSUgZ4GEKiWHyBbp7eguSdfEGY4qWkdAlxpK1YD67Dx3n089bWL0sh0hR6nyHObHdZJrnM1wHj39EveeyG3iCKSaGyNDVeaO7wJqVykjpEmNZnp1G+fsfUn7iX1G+8yC6pEQmU7Ctg//rR3vZ+NiDJMTOYjgOHv+ImnNNbmAlcJ0pJobI4Lkc7Hwh25ISp0uMZaRmaUS+m52G/8o1XnntKHGzZ/NQpoXJ8uo//TN8dY2lWXcxHAePf0TNuaYA8ATgYQqKITJcB+K/6ulVsi0pjNbCtHmY7tDysyMuKv5nDZa7UzEa9EwkX7Of53eUsilfJiF2FuE6ePwjas41BYCVgJspKobI4fH5W4usWakkxM5itJJ18eQuNuG/co3SQ8eoa/BguTsV/TyJifD8jlIWpiaSk24gXAePf0TNuSY38ATgZgqLIXIEAHNnV7ecbUlhrCxMm4dhXiL/fPrfcL77PxAQsMoZjKfXyyupdP0rzz32ILM0IkPp7Orm//v5b6j3XHYDKwEPU5xIZHHUnGsK+PytjIULvquUHa7l5yc/4YW/yufXvyijyPY9huP18kqCbR2E60R1LT/52c/ZlC8TH6thKBd8V9nx2ml8/lYn8BAQYJyoqmpmgmiILB5gT7mrwV70VA4jdTnYSbmrgU+b23iu8FE2FuahS0pgKOWVpzlceZrnCvPos7+8El/zl6xa9jC6pASGUt/oZduufTylLMKo13I7nV3dHPvgIifPegNAMeBknKiqagPs/NkCJoBA5JGATzc9LkvZlhSG69gHFzl51stf/e9/SbHtSXRJCYQr2NZBeeVpjlfX0mf1shwK85ajS0pgKDXu8zy/46cUPHIP1qxUbueC7yoHKz/icrDTBWwAPIwDVVVtgB0w8+82CILgZJxpiDwBoLjc1XBgYdo84mM1hMPnb+Vg5Ufo5szjnf/2IzItJoZLl5TAxsI8NhbmMRyvl1fi2HuI9avvx5qVyq1cDnZy6Pg5Prl0JQAUA07GgaqqNsAOmAkJ3GjHHfCgpGQRYgecjDOByFWVu9ikFCrpDOXkWS/lrgZ0SQm8VbaDTIuJiRBs62Dbrn18+G/n2JQvY9RrGczlYCfHPrhIzbkmQsoABxBgjKmqagPsgJmQwI129jQco6zhGH0+ffwfkGYnErJBEAQn40hD5Npw8qz3d9mWFOk+41wG09nVzWHXx1y4dJUfPrOUusYWni7aSbHtSTYW5jGeyitP49h7iAWGJH74zFLiYzXc7HKwk2MfXKTmXBMhTsABeBhjqqraADtgJiRwo509DccoazhG4EY7/fY0HMP+wBpC7ICTcSQQ2YqSdfGlP3xmKfGxGgbq7Oqm9O0z9Cles4T4WA19LviucrDyI+67x8zu7ZswGvSMpfLK05Q636Gzo431efdzn3EuN6trbKHqd5/xyaUrAaACcAAexpiqqjbADpgJ8bT72fPxv+D81EXgRjs3k2Yn8unj/4A0O5GQDYIgOBknApGvypqVqqxffT8DlR2uJT5Ww6bHZW7W2dXNybNeTp718tjK/8RzhXlkWkyMRn2jl+d3lNLZ0cZjS+/FmpXKQJeDnVSd/Yy6xhYuBzs9wB7ACQQYQ6qqSkARsBWQCPG0+3H8/m2cf6hiKCUPrMH+wBpCPIIgLGCcCEQ+Cfh0/er7JWtWKn2OfXCRusYWitcsIT5Ww61cDnZSdfYzPjj3OQvS7uJnO4sxGvSMxPM7SpnVc5XHlt5LP5+/lbrGFuoaW/D5WwNABfAG4GKMqaoqAUXAVkAixNPux/H7t3H+oYpwSbMT+fTxf0CanUjIBkEQnIwDDZEvADxx8PhHVcYULUa9lpNnvbyQ/xDxsRpuJ1kXT6GSTqGSzr5fujlR/SEbC/MYiRPVtbz8/e9S19hC3cUWLly6yuVgZwCoAI4CFYwDVVUloAjYCkiEeNr9OH7/Ns4/VDFcgRvt7Gk4hv2BNYTYASfjIIapwQNcq21ozstaMJ+qs5+xfvX9DMesGJH3Pmhg3eN/wUiUOd+h6uxnfNjQ7PL5W9/o7OouBoqBo8DHjANVVUuAnwN5QJyn3U/xWScbavbivuphpNwBDy9YVhEXM1sqKSmpczgcHzPGNEwdZZ1d3dkHKz+yEXLyrJfcxSbCtTBtHvt+6SbY1oEuKYEREphYJkAiZEPNf8P5hyrGQuBGO3sajmF/YA0hW4EKxpjI1LLB52+tIKTq7Gf84KcnKDtcS7mrgWMfXOTkWS8XfFe54LvKBd9VLviucsF3lQu+q3xw7nOSdfHUN3oZBYmJ5eBrnvYWxlJZwzECN9oJUVRVVRhjMUw9x4FFnV3diwi5HOzk0z9e44LvKvWey9Sca6LmXBM155pcNeeaPDXnmjw155o89Z7Lrs6u7kCaQW+2yhkM14nqD/FfuXYc8DBBHA5HoKSkxAzI5qQU3viDi7Fyvecr4mNmo9yRRYjZ4XC8wRjSMPUEgCcYGdu5Rq/CCOiSEpgkDsCmpGRhTkzB097CWClrOMbW9MeQZicqqqoqgiC4GCMiM4vH1+xnJDItJkK2MsEEQfAATkLsD6xhLAVutLOn4RhfszOGRGYOGVDqG72MxJykREIKgANMPAchtnsUzIkpjKWyhmN8TVFVVWGMiMwMpZKW3xWtE+2MkFXOQNKCpMUGlDCBBEHwAE5C7A+sYSwFbrTj/IOLr9kZIyJThwS8C6iACqiACnwKVAHvAiWADVD4d4qkpajq9Ri2rhPpU9/oZbiMhvkEWqH0xRgkLXZAZmI5CLHdo2BOTGEsOX7/Nl9TVFVVGAMxTB3blSXCC787rCE+Fg7sjKHsRZGCXEFa+6hoVnLERQ8tEhRJR0HcbMHWfJkSwAYUvLBGlGz5IpIWjp5USUpM5aFMC8MRbOvg9fJKKvbE0HUDXLWqFWgAzIAZMANmwAyYAQloZow4HI5ASUmJGZCl2Ykc9f2WsRL4qh1zYgryXDMhZofD8QajpGFqkICt9s0ikhY8TfDQU90U5IqUvigiaYEcQgQGctWq5jeOqgRa+caBnSIrNhxh1bKHMRr0hKvGfZ6CXIE+9s0iZW/2yuZUoUrSMSjP5+BpUhnABXgAB+BhZN4AbLZ7FBy/fxtPewtjwZyYgjQ7ga8pqqoqgiC4GAUNU0ORskSQlByBPgdeFil9UWTDSz089FQP7+4RkdMFbqbkCJhTBRbkdWPfLGJOBTld4K+fuc7zO0p577VXCNfx6g959D8JDFT1egySliF5msDTpCqOV3txnVEDQDEjIAiCS1VVF6DYH1jDhpq9jIZyRxbPLliJ7R6FAZyAh1ESiXwSsNW+WWQgSQvvlsWwdZ3Ayo09eJoYlDkVbPkijld76WffLDI75jO27dpHOHzNfk5U12LLF+kXaAVJS1hcZ1Q8n0PpiyIhNkbHQYjtHgVzYgojodyRRdVfOqj6Cwe2exS+5gQWCIKwQRAED6MUQ+RbqywR1pZsFhmM9UGBLy7Dj/f38sIakcEoSwQ2v9yDNVvAnCrQZ+2jIlv/66d03RCwyhncjmPvm3wn6xJr8wT6OV7tpWSzSDiOVqlca4W1eSJvHFXjAq3UAR8zAg6Hw1NSUqIAZml2Ikd9vyVcyh1ZHFi6hZIH1mBOTOFrTuAJQRDecDgcAcaISOSz2zeL3E7piyJ9nEdVBiNpwb5ZpPjHvfSTtFD1egwHjhyhvPI0t1LjPs/7vz6NfbNIP1etipwuEC53g4opVaDP1nUCIc8yOg5CbPcomBNTGIpyRxZVf+mg6i8cKClZfM0JLBAEYYMgCB7GWAyRzWZOFWxlL4oMZdE9AsU/6aVonchgrA8K7Dus8sVlUJYI9DHMF8hbJrBxxxkaP/uSpXImsbNn0a++0cv6F39M2f/Ti7JEoF/FSZVrbbA2TyQc+w6rFOQKmFMFFi0Q+PHrvYuAPcB1RsDhcHhKSkoUwCzNTuSo77cMRrkjiwNLt1DywBrMiSl8zQk8IQjCGw6HI8A40RDZ7PbNIuFQcgT6VJxUKcgVGMyBnSIrN/awYomAkiPQR04X+LRSwxNFv+LR75/nucI8Mi0mDleeprzyNAdejsGWLzBQXQOsyBEYCUkLBbkCFSdVG1DGyDkAxXaPguP3b+Npb6GfckcW9gfWoKRkMYATcAiC4GECxBC5bOZUwebcKRIubxN4myDvEYHBGOYLGOYLbHiph7WPikha/iQuFmz5IoszOjn123/j/X89zcK7L/Hzn8SgLBG42YaXeij5gYhhvkA4NrzUS9mLMcTF8idxswXeqlQXAXsYIYfD4SkpKVEAszQ7kaO+36LckcWBpVsoeWAN5sQUQgLAL4AnBEF4w+FwBJggGiKX3b5ZZDhW5Ajs+cdebseWL3CqVuSJrT1UvR6DpOUbSo6AkiNwOxUnVSStgJwuEA5PE0hakLR8oyBXQNJiDrQiA25GzgEotnsUzEl6lJQsvhYA9gBlgiAEmAQxRCabOVWwOXeKDIdhvoD1QQHDfIHbKcgV+M3v4cf7e1n7qEhcLGH72z295D0ioCwRCEfFSZUvLoMtX2SgLy5Dzb+pccBRRsjhcHhKSkoUwGxOTCEkAPwY+CtBECodDsd1JolIZLLbN4sMl6QFOV0gHAdeFpF0sHJjD4FWwuKqVXGdUdm6TiRcR6t6yV8pcLOt60RCCgCJ0XEAAcABLBAEoUQQhACTTCDy2MypwoFPK2OYCBte6sV1RuXdPSJyusCtBFph5cYeCnIF7JtFwuU8qlKQKyBp+Q8eeqoHd4O6AXAyzcQQed4tfTFGkhcJTISCXIE+TxT1IgDyIoG4WL4l0AorN/Yg6eDAyzEMh/kugT5xsfwHcbECR6tUCXiDaSaGyGIzpwo2506RkXroqR5eWCMyHNYHBWz5Inv+sZe/LeulwQOBVvA0wb7DKhte6kFZInLg5RjiYhmWzTt7af5SxfqgwM3MdwnsO9xrvn6DN4AA04iGyCEB9tIXRUbK3aASaGVEzKlQtT8GTxNUnOzlaFUvgVZQcgSqXo9BThcYCXMqeJsYlKSFglwR59HerUAx04iGyFGkLBHMBbkCI+X+GORFjIo5FYrWiRStY0ysWCLgeLWXW3k2X8B5lAKgmGlEJDKYAXvpiyKjUdegIqcLTIgYiXBIWvB8zi0pOQLmVMEMFDCNiESGAyWbReR0gdFwN6isWCIw7mIkuOd9iJEYipwu4GlSuZ2t6wRCnmUa0TD5iuR0Qdm6TmS0XGdU3i0TGFcxEtzzPsRlQ1w2tJ9iKJIWPE1gTmVQtnyR4p/0FgBmwMPYKgBWADLf5gaKGScaJpciaSk9sFNE0jIq7gYVc6qApGX8xEhwz/sQl81wyIsEPE0q5lSBwUhasOWLOI/22oASxoYNKM20mKTVy3Kwyhn0q2/04th7SAGKGScaJo8NKC19MQY5XWC03B+DvIjxdc/7EJfNcEla8HwO5HBLz+YLOI/yLFDCyCmAAuQbDXp59/ZNWOUMBipzvkOp8wghGxhHGiaROVWQbPkCY6GuQUVOFxg3xv0Ql823xGdD+ymGIqcLeJtUQOBWlBwBc6pg9jSpBUAF4TEDBUA+oGRaTNQ3elm1LIfd2zehS0qgX7Ctg+d3/JQa93k3sAFwM440TB6np0ndWvZmr1y0TmS03A0q9s0i48K4H+au5z+IkQhXoJUhbV0nUPwT9VmggtuTgVJdUoKyalkOS+UMVi3LQZeUQH2jl0yLiYHqG708XbSTYFuHEygGAowzDZOr2PFqb1VBrog5lVFxnVE58LLAmDPuh7nrGY0VSwQcr/YyFFu+SPFPegsAM+Dh1t61b3nGvLEwj5tlWkwMdKK6lm279hFs69gAOJkgIpPLFWilbMNLPYyGu0FF0oI5lbFl3A9z13NL4hzGkqQFW75IyFa+TQFkwAy8azTozRsL8xjKiepant9RSrCtYwPgZAJpmHwO1xlVcbzaK9s3i4yE53OQFwmMKeN+mLue24rPJhySFjyfE5YVOQIf1AlKg0f9HSATkmkx4Wv2E2zrwGjQs2rZw4TjcOWvCCkGnEwwDZMvAGwoebW3ypQqSLZ8geGqa1BRcgTGjHE/zF3PWJHTBTxNKrfjqlXZsKOX7t75rFr2sPyjohyscgZ96hu9PF20k93bN+Fr/hKjYT7hqHHXE1LBJNAQGdzAyg0v9VRBjGTLFxgOV63K1v8sMiaM+2HueiZS8U96eb0iDvuWZyjMW87NHHsP8VzhoxTmLSdc9Y1egm0dhCiAE7ABz/JnR4EyxpGGyOEGHBte6ikNtIoUrRMJl/tjlUArozd3Pcxdz6B6AhAj8S1x2QxHoBUkLd+y4aVefnsujfdeK8Zo0HOzYFsHNe7z/GznXzMcmRYTu7dvYn955YH6Ru+BTIuJ5wrz6FPqfEfxNfsDgJNxIhJhrHIGuw8m80RRD4FWhuRpgkAr7Hmzl1GZux6M+7mlr7z8BzES4VKWCLgbVAYqe7OX93+TzFtlOzAa9AymvtGLVc5Al5TAcNS4zxNs62D1shyMBj1vle2gMG85hXnL0SUlEBJgHIlElhVP5S3nvddeQTP7uyzI68bxai+eJm7J/bFKiMvdoAbcDSojMnc9GPdzS1/+PcRlM5YCreB4tZfd2zehS0rgVmrc58m0mAhXjfs8jr2HeH7HTznX6KXUeYTnCvPQJSXQp8Z9nvpGbwCoYBxpiCyKVc5Al5TA7u2bqHEv53DlaRbknUZOF1CWCEhavuGqVXGdUQk5BXhcZ1SbnC4wLHPXg3E/t9QTgK+8jLU9b/ay6N4MrHIGQ5mTlEg4Xi+vpNR5hGBbB++99gqZFhN9gm0d9DtceZoQJ+NMQ+SQdUkJktGgp59VzsAqZ2Df8gz1jV5q3Oe51gmHK0/ja/ZXAG8ALiAAFBytUm1F6wjf3PVg3M9t/XEbzF3PLSWugPZThCMQBE8T7HmzF+fRXva9/CRjaWNhHrqkBHzNX5JpMdEnzaBnIF+zn5CjjDMNkUOxypkMRpeUgFXOwCpn0Gd/+XuEOAA3/87lOqMStrnrwbif27peB+2nwLif0VJyBJ4o6kGXlECmxUSv6sUqZzAUo2E+x6s/5Gb1jV6CbR1kWkzokhLoV5i3nIGutbVT4z5Pn+PVtdQ3egOAh3GmIXJkL5UzGEqN+zzBtg4P4ObbAoDbVavKSo7Abc1dD8b9DKlpG+jyGUMuQHmuMI/95ZWEwypn4Nh7iGBbB7qkBPqcqK5l2659GA16gm0dvPfaK+iSEqhxnyfTYkKXlEC/E9Uf4mv2l9U3eq8BHqACCDDORCKDBChWOYOhHK+uJaSCwblOnVG5rbhsuHM3Qwr+EtpPQfJ/4bZmmxiGU8G2Ds/hyl+xVM4kHEaDHquciWPvIfo59r6JfcszvPfaK2RaTDj2HqK+0cu2Xft4ZO1WypzvEGzrwLH3EL5mvxsoBkoAJxBgAohEhncBc6bFxFBOVH9IyCkGd8pVq3JLcdlwz/sQIzGkP/41xGXDbBO3NdvMMFVkWUwU2b5HuHZv30R9o5eni3ZSXnmaYFs7hXnL6WPfso4T1bU8+v0f4mv2O4JtHStLnUdcD/xvz/N6eaUH2MAk0DD5bEaDXnnvtVcYiq/Zj6/ZHwAqGJzb/bHKLV2vgz/8JczJB93jEJfNoFpehhteuPO/MA6uXWr2Mxy6pAR+trOYR7//Q7bt2hewyhkSXzMa9ATbOgh5CHDzZy4mmcjks+/evgldUgJDOVH9ISEubs0TaCXgblC5pet18MWP4EIONFjA9xwEf8k3egLw5d/zJ7p8xkHFiepayitPEy5fs5/nd5QSbOtwAg5ukmkxESIRQTRMLpvRoDdb5QzCcby6lpCj3J7b/TGKnM7QbnjhxkG4epA/0T3On/QEIC6bsCQuZ5jcwbaOJ7bt2lda6nzHXGz7HoV5y7mVGvd5nt/xU4JtHU5gAyDXN3o5UV2LVc6kxl1PfaM3ALiJIBomV/5zhXmEI9jWQY37PCEV3N6pugZVAYFhC/6Sb1yvgwYLxGXDnHzQPQ5x2YyRCqDC1+y3bdu1z17qfMf8XGEeq5Y9jNGgp0+wrYNS5xFeL68MAMWAkz9zB9s6nnh+R6kdkAE34AACRBANk6tg1bKHCceJ6lpCXECA23O7G1TGRFw29Abgix/BFz+C2SZIXAG6fNA9zhhwAk5fs7/AsffQs469hwoyLSZ0SQnUN3oJtnW4gA2Ah2+rACqIYBomT0GmxYTRoCccH7jPE3KUobndH6uMiTn5kPISXK+Dqwfh6kG4ehCuHoQYCRKXw2wzY6ACqCCkvtGr8GcewMMUJTJ5ZKucQbhOVNcSUsHQPIFW8DQxem2n+JO4bLhzN8wy8Y2eAAR/CV/+PWPMBbgAD1OYyORZsVTOIBw17vME2zo8gIfwuDxNKqN2vY5vXK+D63WMVHa6QMgKZgiRiaUAClAEyJkWE+E4Xl1LSAXhc586ozJqPQG44eVPvvx7RkPSMaNomBglwNZMi0nSJSVgNOhJM+gxGvSE40T1h4QcJXxeTxNj43odxMyB4C8ZDUlLH5kZQsP4koB3My0mZff2TWRaTAyXr9mPr9kfAFyEz+1pUhkT1+ugJwA9AUZDThcIkZghNIwfCahatSxH3r19E7qkBEbiRPWHhFQwPG7XGZUx0XYKegKMIQkIMM2JjA8JqCrMWy7/bGcxuqQERupw5WlCTjE8AUICrYxe+ym4XsdYUJYIhMjMACLj48CqZTny7u2bGMjX7CfY1kG4gm0d1Dd6Calg+FzuBpUIJDEDiIw9xWjQF+zevol+9Y1etu3axyNriyh1HuFW6hu91LjPE2zroM+J6lpCXECA4Qt4PieiKDkCITIzgIaxpxgN86lx11Pf+BnHq2upb/QGgArg1InqDw/YtzzDQDXu82zbtY8+uqQEgm0d/PoXZRyv/pCvlQBlQIDw1Xmb1AIQiDBzmAE0jL2yGvf5OTXu8zJwCnADFXzN1+y3n6iuNa9alkMfx95DlFeeptj2JBsL8+jz6Pd/yNNFO6lv9LKxME/xNX+pnKiuzQceInwBTxMRJTtdIERmBtAw9gJAMbe253Dlr0qtciZPF+2kz3uvvYLRoKefr9mP0aDnvddewWjQ08ek/GeZPysBVgDFgJtbc3uaVCKJpKOPxAwgMvE8vmY/vmY/VjmD9157BaNBT7/XyyvJtJh4q2wHRoOePr5mPyEB4ECmxWQvtj2pAO8yxSg5AiEyM4DIxFthlTPItJiwb3mGgeobvZQ6j1BsexJdUgL9nt9RSoiUaTHZ3irbQZHte+iSEsyAmalJYpoTmXjy6mU53KzGfZ6ni3Zi3/IMVjmDfo69h+izalkOu7dvQpeUQJ9Mi4kQM1OMskQgRGaa0zDxZKNhPgOVV55m26597N6+icK85fQ7UV1LeeVp3nvtFYwGPf2CbR3UN3oJ8TDFSFr6mJnmNEw859NFf1f0VN5y+lxq9lNeeZpi25MU5i2nn6/Zz7Zd+9i9fRNGg56BHHsPEWzrcAEebs0saYk4crpAxUnVzDSnYeIV+5r9p0qdR2TABHgBV6nzyLvnGr3Sc4V5BNvacex9k2BbR8Cx902pvvEzMi13E2zrYH95JfWNXjfwBLeXLacLRBpTqkBINtOchslRAVTwbQtOVNcWnaiuzefP9gBOX7O/oNR5ZAUgAwHgKOBkaAUrlghEGvNd9DEzzWmIHAGgBCjh2yqACobHLGkxKzkCkUbJEQiRmeZEpqeCglyRSCVp6SMzjYlMT8/mrxSIVPIigRAz05jI9GOWtMgFuQKRSk4XCJGZxkSmn4KCXJFIlp0uEJLNNCYy/eSvyBGIZOa76CMzjYlMP4q3SWUKMAMS01QM088pV62qnKpVJWWJiKQlYniaYMNLPfxtWW8A+FvAxTQlMD1JQBFgt+WL2DeLmFOZVI5Xeyl7s5dAK06gGAgwjQlMb2bADths+SL2zSLmVCZUxUmV4p/04mlSXYADcDEDCMwMZsAO2ApyBZ59XKQgV2A8uWpVHK/24jqjegAH4GQGEZhZJKAIeNacKpgLcgWezReQ0wXGiqtWxfFqL64zagDYA5QBAWYYgZlLAZ4FCsypglSQK5CfK6DkCIxExUmVPf/Yi+uMGgD2AGVAgBlKIKpPAbACKADMyhIBJUdgxRIBc6qAOZVBuWpVjp5UqTip4mlSPYADqAACzHACUTczAwqQDciADEhyuoCk4xuuMyohbsAFvAG4ifqGQFS4FL7NDQSIioqaOP8/U3Le9oR3CxUAAAAASUVORK5CYII="
  },
  {
    "width": 75,
    "height": 98,
    "url": "data:image/png;base64,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"
  },
  {
    "width": 38,
    "height": 49,
    "url": "data:image/png;base64,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"
  },
  {
    "width": 19,
    "height": 25,
    "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAZCAYAAADTyxWqAAAAAklEQVR4AewaftIAAAOISURBVO3Be0zUBQDA8e/vcS/u4I47HncgeEwOfIGRjh7gJHFzOmTrYVFrq1X+U6utpo3pasumzo3+UJvg/APbanNtt1ybUywnG6AQnQISEqaI0IEHx/E67rjj/IV2f1yMo1r/9vnwv39NYnkWQAJC/AMCS9hXVVybakrYLYqCGYVwOPJwYNg7c/a40/Upy5BY5N3ni/YbdOoPzIm6JLVKElSyJGnVssVk0G4uXJVa2HLz92+JQ2KRyhLHaVHSWtU6E8ZkK+b0lUjaZLy+SWQhojEZNJm998d/ZAkyf/WMKAi52fZ8cnJyMSbq0SdoGRoZw2w2CzWn6usuuwbqiUMkRmlBZpEhQS3lOfLIykjDoNcRCM6Rs8LK2jwH28u2vAJ4iUMkhsc3+0AAbvV0gQKhUJj5+QiT034eSTFIG/dVFdcTh0iMviGfczYYdgcmB7nadg1RFDGbkjAm6pkLhZjyDQspxoQXbBb9TpYgs8iDcb8zQat6f3RslFAoTHg+Aij81N6m+Gf9v/YMjB1yj80093junJgITNlK7E++RJTEIq097gsZKfptOilsSDSlR1bY0tStrs6OhsYrh445XW903Rn1Obsv3tjbfnLb9MyEo/mrhpufHzzYywKRJeyu6PZW7mjplMX+AAvSU4KWA+/1Pv3NEeFjQRAGww/nh36en6Fx4paqY7j3LaJkFjl5QNizZRMV07NIyUlnmJ2OkGNrzHJk87o/wAhQs2tNeV19eC5rY2bB+QJr3idECSzSf1G4Yc/giYkpMCXByBhodU9h0rfhGYfLrVS/Vq0c5U+lQDNRMjHMRjYbDaxmwVyYx6zp2yH7GPSvRlFgvcPxau1nO9YV5ueU994dvPL2/i+aiZKJMT5Jk6vvw67stP51avmcH+m5NOx1oLEARtyjNkWX+NGGwnz/BpUs4/FO2IkhE8OWai6xpa1Z75nKak81nJtEzq3E1wjmcpDW4g8aOxVVOOPu4PC9nt8GXEdOnT1KDJmo6j1Vu3aWFR826HUJV6//0hy0osu3n4a5r2H2TYhcw2rG7ai4UEQcIlEWc2Kyx+sb7+7rJ6IopfXfKbd5LADBWh7RabCwDImoH1qud0YiyrAkifc1atXtrZvabauyeJYYwRChmjMcJw6ZGM5LTQ3OS00NLPj+hLDXPco9i5GVGjXClJ+g20MH/8U7L/Ly+S85vLWYMv7GH6XFS0JgQCqKAAAAAElFTkSuQmCC"
  },
  {
    "width": 10,
    "height": 13,
    "url": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAANCAYAAACQN/8FAAAAAklEQVR4AewaftIAAAFfSURBVK3BTyhDcQAH8O/bezZmtj1snGbmTwsrLG8tJcq/4oCLRbFycFYOSi1NOzgpuaBWcqbmxi6LJMmfm3dw0NDa2GJ/2HvM81Pv8HJw8vng31GQzXu4ETOrnZG+8P74lN5a27sMQ4GGrNdpC1WwlW4ja2qmJLGnTEvf8NHULWQMCM5e3VVXb29wtnP4EYsncgsbi0dQUIF4yeZTmVRMFAUBDE2DRqFxydu5CgUaRDKdT3B2k4tR6ywGg0E4Oz89sEzP3rZOdq0fBvcjy37/kwoyr+ck7WiIZBmKZ0YHds1GY3k6KbwYrmN8BwgGBKuH1VSOYUgXepQOQMrBVXQcOO9Hd6hjsGUbhAqERsNK/L0vWaD64lrLFLL5tqxOPzTxlheskDEgNv1zvtdciYBC+BlRb5Wu+CrlHr+qgQINQvz4vCli6Lum2gtHifrB8i4gsxLEKv6yE8BYDwcbfvkGYAl5LwBdm9oAAAAASUVORK5CYII="
  }
];
mipmaps.forEach( mipmap => {
  mipmap.img = new Image();
  const unlock = simLauncher.createLock( mipmap.img );
  mipmap.img.onload = unlock;
  mipmap.img.src = mipmap.url; // trigger the loading of the image for its level
  mipmap.canvas = document.createElement( 'canvas' );
  mipmap.canvas.width = mipmap.width;
  mipmap.canvas.height = mipmap.height;
  const context = mipmap.canvas.getContext( '2d' );
  mipmap.updateCanvas = () => {
    if ( mipmap.img.complete && ( typeof mipmap.img.naturalWidth === 'undefined' || mipmap.img.naturalWidth > 0 ) ) {
      context.drawImage( mipmap.img, 0, 0 );
      delete mipmap.updateCanvas;
    }
  };
} );
export default mipmaps;