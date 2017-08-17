import React from 'react'
import { Link } from 'react-router'
import Color from 'color'

import Icon from 'metabase/components/Icon'
import Tooltip from 'metabase/components/Tooltip'
import { XRayPageWrapper, Heading } from 'metabase/xray/components/XRayLayout'
import ItemLink from 'metabase/xray/components/ItemLink'

import CostSelect from 'metabase/xray/components/CostSelect'
import Histogram from 'metabase/xray/Histogram'

import { getIconForField } from 'metabase/lib/schema_metadata'
import { distanceToPhrase } from 'metabase/xray/utils'

const ComparisonField = ({ field }) =>
    <li
        key={field.id}
        className="my2 mr2 inline-block"
    >
        <Tooltip tooltip={field.description}>
            <div className="flex align-center">
                <Icon name={getIconForField(field)} className="mr1 text-grey-2" size={22} />
                <h3>{field.display_name}</h3>
            </div>
        </Tooltip>
    </li>

const CompareInts = ({ itemA, itemAColor, itemB, itemBColor }) =>
    <div className="flex">
        <div
            className="p2 text-align-center flex-full"
            style={{
                color: itemAColor.text,
                backgroundColor: Color(itemAColor.main).lighten(0.1)
            }}
        >
            <h3>{itemA}</h3>
        </div>
        <div
            className="p2 text-align-center flex-full"
            style={{
                color: itemBColor.text,
                backgroundColor: Color(itemBColor.main).lighten(0.4)
            }}
        > <h3>{itemB}</h3>
        </div>
    </div>

const CompareHistograms = ({ itemA, itemAColor, itemB, itemBColor }) =>
    <div className="flex" style={{ height: 60 }}>
        <div
            className="flex-full"
        >
            <Histogram
                histogram={itemA}
                color={[itemAColor.main, itemBColor.main]}
                showAxis={false}
            />
        </div>
    </div>


const XRayComparison = ({
    contributors,
    comparison,
    comparisonFields,
    itemA,
    itemB,
    fields,
    cost
}) =>
    <XRayPageWrapper>
        <div>
            <div className="my4 flex align-center">
                <h1 className="flex align-center">
                    <Icon name="compare" className="mr1" size={32} />
                    Comparing
                </h1>
                <div className="ml-auto">
                    <CostSelect
                        currentCost={cost}
                    />
                </div>
            </div>
            <div className="flex">
                <ItemLink
                    link={`/xray/${itemA.itemType}/${itemA.id}/approximate`}
                    item={itemA}
                />
                <ItemLink
                    link={`/xray/${itemB.itemType}/${itemB.id}/approximate`}
                    item={itemB}
                />
            </div>
        </div>

        <Heading heading="Overview" />
        <div className="bordered rounded bg-white shadowed p4">
            <h3 className="text-grey-3">Count</h3>
            <div className="flex my1">
                <h1
                    className="mr1"
                    style={{ color: itemA.color.main}}
                >
                    {itemA.constituents[fields[0].name].count.value}
                </h1>
                <span className="h1 text-grey-1 mr1">/</span>
                <h1 style={{ color: itemB.color.main}}>
                    {itemB.constituents[fields[1].name].count.value}
                </h1>
            </div>
        </div>

        { contributors && (
            <div>
                <Heading heading="Potentially interesting differences" />
                <ol className="Grid Grid--gutters Grid--1of3">
                    { contributors.map(contributor =>
                        <li className="Grid-cell">
                            <div className="bg-white shadowed rounded bordered">
                                { /* <ComparisonField field={field} /> */}
                            </div>
                        </li>
                    )}
                </ol>
            </div>
        )}

        <Heading heading="Full breakdown" />
        <div className="bordered rounded bg-white shadowed">

            <div className="flex p2">
                <h4 className="mr1" style={{ color: itemA.color}}>
                    {itemA.name}
                </h4>
                <h4 style={{ color: itemB.color}}>
                    {itemB.name}
                </h4>
            </div>

            <table className="ComparisonTable full">
                <thead className="full border-bottom">
                    <tr>
                        <th className="px2">Field</th>
                        {comparisonFields.map(c =>
                            <th
                                key={c}
                                className="px2 py2"
                            >
                                {c}
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody className="full">
                    { fields.map(field => {
                        return (
                            <tr key={field.id}>
                                <td className="border-right">
                                    <Link
                                        to={`/xray/field/${field.id}/approximate`}
                                        className="px2 no-decoration flex align-center text-brand-hover"
                                    >
                                        <Icon name={getIconForField(field)} className="text-grey-2 mr1" />
                                        <h3>{field.display_name}</h3>
                                    </Link>
                                </td>
                                <td className="border-right px2">
                                    <h3>{distanceToPhrase(comparison[field.name].distance)}</h3>
                                </td>
                                <td className="border-right">
                                    { itemA.constituents[field.name]['entropy'] && (
                                        <CompareInts
                                            itemA={itemA.constituents[field.name]['entropy']['value']}
                                            itemAColor={itemA.color}
                                            itemB={itemB.constituents[field.name]['entropy']['value']}
                                            itemBColor={itemB.color}
                                        />
                                    )}
                                </td>
                                <td
                                    className="px2 border-right"
                                    style={{minWidth: 400}}
                                >
                                    { itemA.constituents[field.name]['histogram'] && (
                                    <CompareHistograms
                                        itemA={itemA.constituents[field.name]['histogram'].value}
                                        itemAColor={itemA.color}
                                        itemB={itemB.constituents[field.name]['histogram'].value}
                                        itemBColor={itemB.color}
                                    />
                                    )}
                                </td>
                                <td className="px2 h3">
                                    { itemA.constituents[field.name]['nil%'] && (
                                        <CompareInts
                                            itemA={itemA.constituents[field.name]['nil%']['value']}
                                            itemAColor={itemA.color}
                                            itemB={itemB.constituents[field.name]['nil%']['value']}
                                            itemBColor={itemB.color}
                                        />
                                    )}
                                </td>
                            </tr>
                        )})}
                </tbody>
            </table>
        </div>
    </XRayPageWrapper>

export default XRayComparison
